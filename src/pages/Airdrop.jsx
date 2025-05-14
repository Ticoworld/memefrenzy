import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";
import BN from "bn.js";
import bs58 from "bs58";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { CONFIG } from "../config";
import LoadingSkeleton from "../components/LoadingSkeleton";

const useStreamflowVerification = () => {
  const { connection } = useConnection();

  const verifyTx = useCallback(
    async (txId, walletAddress) => {
      try {
        new PublicKey(walletAddress);
        const tx = await connection.getParsedTransaction(txId, {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
        });
        if (!tx?.transaction) throw new Error("Invalid transaction data");

        const txAgeDays =
          (Date.now() - tx.blockTime * 1e3) / (1000 * 3600 * 24);
        if (txAgeDays > 90)
          throw new Error("Transaction too old (max 90 days)");

        const signers = tx.transaction.message.accountKeys
          .filter((k) => k.signer)
          .map((k) => k.pubkey.toString());
        if (!signers.includes(walletAddress)) {
          throw new Error("Wallet not transaction signer");
        }

        const topLevel = tx.transaction.message.instructions.map((ix) =>
          ix.programId.toString()
        );
        const inner = (tx.meta?.innerInstructions || [])
          .flatMap((ii) => ii.instructions)
          .map((ix) => ix.programId.toString());
        const programs = [...topLevel, ...inner];
        if (
          !programs.includes(CONFIG.STREAMFLOW_PROGRAM_ID) &&
          !programs.includes(CONFIG.STAKE_POOL_PROGRAM_ID)
        ) {
          throw new Error(
            "Not a Streamflow or related stake-pool Tx. Please use a valid staking Tx ID."
          );
        }

        const stakeIx = tx.transaction.message.instructions.find(
          (ix) => ix.programId.toString() === CONFIG.STAKE_POOL_PROGRAM_ID
        );
        let durationSeconds = 0;

        if (stakeIx) {
          if (
            stakeIx.parsed &&
            stakeIx.parsed.info &&
            stakeIx.parsed.info.duration
          ) {
            durationSeconds = Number(stakeIx.parsed.info.duration);
            if (isNaN(durationSeconds)) {
              console.error(
                "Failed to convert pre-parsed duration:",
                stakeIx.parsed.info.duration
              );
              durationSeconds = 0;
            }
          } else if (stakeIx.data) {
            const buf = Buffer.from(bs58.decode(stakeIx.data));
            const DURATION_OFFSET_START = 20;
            const DURATION_OFFSET_END = 28;

            if (buf.length >= DURATION_OFFSET_END) {
              try {
                const durationRawBytes = buf.subarray(
                  DURATION_OFFSET_START,
                  DURATION_OFFSET_END
                );
                durationSeconds = new BN(durationRawBytes, "le").toNumber();
              } catch (e) {
                console.error("BN parsing error:", e);
              }
            }
          }
        }

        const lockDurationDays = durationSeconds / 86400;
        if (lockDurationDays < CONFIG.MIN_LOCK_DURATION_DAYS) {
          throw new Error(
            `Lock period too short: ${lockDurationDays.toFixed(1)}d (min ${
              CONFIG.MIN_LOCK_DURATION_DAYS
            }d)`
          );
        }

        const transfers =
          tx.meta?.innerInstructions
            .flatMap((ii) => ii.instructions)
            .filter(
              (ix) =>
                (ix.parsed?.type === "transfer" ||
                  ix.parsed?.type === "transferChecked") &&
                ix.parsed.info.mint === CONFIG.MEME_MINT_ADDRESS
            ) || [];
        const stakedAmount = transfers.reduce((sum, ix) => {
          const amt =
            Number(
              ix.parsed?.info.tokenAmount?.amount || ix.parsed?.info.amount || 0
            ) /
            10 ** (CONFIG.TOKEN_DECIMALS || 6);
          return sum + (isNaN(amt) ? 0 : amt);
        }, 0);
        if (stakedAmount < CONFIG.MIN_STAKE_AMOUNT) {
          throw new Error(
            `Staked: ${stakedAmount} $MEME (min ${CONFIG.MIN_STAKE_AMOUNT})`
          );
        }

        let rewardPercentage = 0;
        let tier = "";
        if (stakedAmount >= 100000 && stakedAmount < 1000000) {
          rewardPercentage = 0.05;
          tier = "5%";
        } else if (stakedAmount >= 1000000 && stakedAmount < 5000000) {
          rewardPercentage = 0.1;
          tier = "10%";
        } else if (stakedAmount >= 5000000) {
          rewardPercentage = 0.15;
          tier = "15%";
        }

        let bonus = "";
        if (lockDurationDays > 90) {
          rewardPercentage += 0.02;
          bonus = " + 2% lock bonus";
        }

        rewardPercentage = Math.min(rewardPercentage, 0.17);
        const rewardAmount = stakedAmount * rewardPercentage;

        return {
          isValid: true,
          stakedAmount,
          lockDurationDays,
          rewardAmount,
          tier,
          bonus,
        };
      } catch (err) {
        console.error("Verification error:", err);
        let reason = err.message;
        if (reason.includes("429"))
          reason = "Rate limit exceeded—try again later.";
        if (reason.includes("403")) reason = "API access denied.";
        return { isValid: false, reason };
      }
    },
    [connection]
  );

  return { verifyTx };
};

const Airdrop = () => {
  const { publicKey, connected } = useWallet();
  const { verifyTx } = useStreamflowVerification();
  const [status, setStatus] = useState({
    loading: false,
    loadingMessage: "",
    eligible: null,
    message: "",
    claimId: null,
  });
  const [topStakers, setTopStakers] = useState([]);
  const [loadingStakers, setLoadingStakers] = useState(true);
  const [campaignStatus, setCampaignStatus] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [useManualAddress, setUseManualAddress] = useState(false);

  useEffect(() => {
    const fetchCampaignStatus = async () => {
      try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/api/campaign/status`);
        if (!res.ok) throw new Error("Failed to fetch campaign status");
        const data = await res.json();
        setCampaignStatus(data);
      } catch (err) {
        console.error("Failed to fetch campaign status:", err);
        toast.error("Failed to load campaign status");
      }
    };
    fetchCampaignStatus();
  }, []);

  const isCampaignActive = campaignStatus
    ? campaignStatus.isActive && new Date() <= new Date(campaignStatus.endDate)
    : false;
  const formattedEnd = campaignStatus
    ? new Date(campaignStatus.endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Loading...";
  const endMessage = campaignStatus?.isActive
    ? `Airdrop ends on ${formattedEnd}`
    : `Airdrop campaign is currently disabled.`;

  useEffect(() => {
    const fetchTopStakers = async () => {
      setLoadingStakers(true);
      try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/api/top-stakers`);
        if (!res.ok) throw new Error("Failed to fetch top stakers");
        const data = await res.json();
        setTopStakers(data);
      } catch (err) {
        console.error("Error fetching top stakers:", err);
        toast.error("Failed to load top stakers");
      } finally {
        setLoadingStakers(false);
      }
    };
    fetchTopStakers();
  }, []);

  useEffect(() => {
    if (connected && !useManualAddress) {
      setValue("walletAddress", publicKey?.toString() || "");
    } else if (!useManualAddress) {
      setValue("walletAddress", "");
    }
  }, [connected, publicKey, setValue, useManualAddress]);

  const handleShareOnX = () => {
    const amount =
      status.message.match(/You'll receive (.*?) \$MEMEFRENZY/)?.[1] || "an";
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(
        `I just claimed ${amount} $MEMEFRENZY airdrop! 🎉`
      )}`,
      "_blank"
    );
  };

  const handleSubmission = async ({ txId, walletAddress }) => {
    setStatus({
      loading: true,
      loadingMessage: "Checking transaction...",
      eligible: null,
      message: "",
      claimId: null,
    });
    try {
      if (!isCampaignActive) {
        throw new Error(
          campaignStatus?.isActive
            ? "Airdrop campaign has ended."
            : "Airdrop campaign is currently disabled."
        );
      }

      await new Promise((r) => setTimeout(r, 1000));
      const v = await verifyTx(txId, walletAddress);
      if (!v.isValid) throw new Error(v.reason);

      setStatus((s) => ({ ...s, loadingMessage: "Verifying eligibility..." }));
      const dup = await fetch(`${CONFIG.API_BASE_URL}/api/check-duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txId, walletAddress }),
      });
      if (!dup.ok) {
        const { message } = await dup.json();
        throw new Error(message || "Duplicate TX");
      }

      setStatus((s) => ({ ...s, loadingMessage: "Submitting claim..." }));
      const claimRes = await fetch(`${CONFIG.API_BASE_URL}/api/submit-claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txId,
          walletAddress,
          stakedAmount: v.stakedAmount,
          lockDurationDays: v.lockDurationDays,
          rewardAmount: v.rewardAmount,
        }),
      });
      if (!claimRes.ok) {
        const { error } = await claimRes.json();
        throw new Error(error || "Failed to register claim");
      }
      const { claimId } = await claimRes.json();

      setStatus({
        loading: false,
        loadingMessage: "",
        eligible: true,
        message: `✅ Approved! You'll receive ${v.rewardAmount.toFixed(
          2
        )} $MEMEFRENZY after the campaign ends.\n\nYou staked ${
          v.stakedAmount
        } $MEME, locked for ${v.lockDurationDays.toFixed(1)} days.\n\nTier: ${
          v.tier
        }${v.bonus}.`,
        claimId,
      });
      toast.success("Successfully registered for airdrop!");
    } catch (err) {
      setStatus({
        loading: false,
        loadingMessage: "",
        eligible: false,
        message: `❌ Error: ${err.message}`,
        claimId: status.claimId,
      });
      if (err.message.includes("Duplicate TX") && status.claimId) {
        toast.error(
          `You have already claimed this TX. Your Claim ID: ${status.claimId}`
        );
      } else {
        toast.error(err.message);
      }
    }
  };

  useEffect(() => {
    if (topStakers.length === 0) return;

    const showToast = () => {
      const randomStaker =
        topStakers[Math.floor(Math.random() * topStakers.length)];
      const roi = (
        (randomStaker.rewardAmount / randomStaker.stakedAmount) *
        100
      ).toFixed(2);
      toast.success(
        `Top staker earned ${randomStaker.rewardAmount.toLocaleString()} $MEMEFRENZY with ${randomStaker.stakedAmount.toLocaleString()} $MEME staked! ROI: ${roi}%`
      );
    };

    const interval = setInterval(showToast, 30000);
    return () => clearInterval(interval);
  }, [topStakers]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center p-4">
      <div
        className="max-w-lg w-full bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl"
        data-aos="fade-up"
      >
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          $MEME Airdrop Eligibility
        </h1>
        <p className="text-gray-300 text-center pb-5">{endMessage}</p>
        <div className="flex justify-center mb-6">
          <WalletMultiButton
            className="!bg-gradient-to-r !from-purple-600 !to-pink-600 !text-white !font-semibold !py-3 !px-6 !rounded-full !shadow-lg hover:!from-purple-700 hover:!to-pink-700 !transition-all !duration-300"
            aria-label="Connect wallet"
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={useManualAddress}
              onChange={(e) => {
                setUseManualAddress(e.target.checked);
                if (!e.target.checked && connected) {
                  setValue("walletAddress", publicKey?.toString() || "");
                } else {
                  setValue("walletAddress", "");
                }
              }}
              className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded"
            />
            <span className="text-sm font-medium">
              Enter wallet address manually
            </span>
          </label>
        </div>

        {!campaignStatus?.isActive && (
          <div className="mb-6 p-4 bg-red-700/20 border border-red-500 rounded-lg">
            <p className="text-red-300 text-center">
              The airdrop campaign is currently disabled.
            </p>
          </div>
        )}

        {campaignStatus?.isActive && new Date() > new Date(campaignStatus.endDate) && (
          <div className="mb-6 p-4 bg-red-700/20 border border-red-500 rounded-lg">
            <p className="text-red-300 text-center">
              The airdrop campaign has ended on {formattedEnd}.
            </p>
          </div>
        )}

        {status.loading ? (
          <div className="text-center">
            <LoadingSkeleton />
            <p className="text-gray-300 mt-2">{status.loadingMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleSubmission)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Wallet Address
              </label>
              <input
                {...register("walletAddress", {
                  required: "Wallet address is required",
                  validate: (value) => {
                    try {
                      new PublicKey(value);
                      return true;
                    } catch {
                      return "Invalid Solana address";
                    }
                  },
                })}
                className={`w-full p-3 rounded-lg bg-gray-700/50 border ${
                  errors.walletAddress ? "border-red-500" : "border-gray-600"
                } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                readOnly={connected && !useManualAddress}
                placeholder={
                  connected && !useManualAddress
                    ? "Wallet address autofilled"
                    : "Enter your wallet address"
                }
                aria-readonly={connected && !useManualAddress}
              />
              {errors.walletAddress && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.walletAddress.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Transaction ID
              </label>
              <input
                {...register("txId", {
                  required: "Transaction ID is required",
                  pattern: {
                    value: /^[1-9A-HJ-NP-Za-km-z]{86,88}$/,
                    message: "Invalid Solana TX ID (must be 86-88 characters)",
                  },
                })}
                className={`w-full p-3 rounded-lg bg-gray-700/50 border ${
                  errors.txId ? "border-red-500" : "border-gray-600"
                } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                placeholder="Enter Streamflow TX ID"
                aria-describedby="txIdHelp"
              />
              {errors.txId && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.txId.message}
                </p>
              )}
              <p id="txIdHelp" className="text-xs text-gray-400 mt-1">
                Find this in your wallet transaction history
              </p>
            </div>

            <button
              type="submit"
              disabled={status.loading || !isCampaignActive}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-full shadow-lg hover:from-purple-700 hover:!to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status.loading
                ? "Verifying..."
                : isCampaignActive
                ? "Check Eligibility"
                : campaignStatus?.isActive
                ? "Campaign Ended"
                : "Campaign Disabled"}
            </button>
          </form>
        )}

        {status.message && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              status.eligible ? "bg-green-700/20" : "bg-red-700/20"
            } border ${
              status.eligible ? "border-green-500" : "border-red-500"
            }`}
          >
            <p
              className={status.eligible ? "text-green-300" : "text-red-300"}
              style={{ whiteSpace: "pre-line" }}
            >
              {status.message}
            </p>
            {status.eligible && status.claimId && (
              <div className="mt-2 flex items-center">
                <span className="text-gray-300 mr-2">Claim ID:</span>
                <span className="text-white bg-gray-700 px-2 py-1 rounded">
                  {status.claimId}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(status.claimId);
                    toast.success("Claim ID copied to clipboard!");
                  }}
                  className="ml-2 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-all duration-300"
                >
                  Copy
                </button>
              </div>
            )}
            {status.eligible && (
              <button
                onClick={handleShareOnX}
                className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Share on X 🐦
              </button>
            )}
          </div>
        )}
      </div>

      <div className="max-w-lg w-full mt-6 bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
        <details className="group">
          <summary className="text-lg font-semibold text-gray-300 cursor-pointer">
            Reward Criteria{" "}
            <span className="text-purple-400">(Click to expand)</span>
          </summary>
          <div className="mt-2 text-sm text-gray-400">
            <p>
              <strong>Tiered Rewards:</strong>
            </p>
            <ul className="list-disc pl-5">
              <li>100K–1M $MEME: 5% reward</li>
              <li>1M–5M $MEME: 10% reward</li>
              <li>5M+ $MEME: 15% reward</li>
            </ul>
            <p>
              <strong>Bonus:</strong> +2% if locked &gt;  90 days (max 17%
              total).
            </p>
            <p>
              <strong>Minimum:</strong> 100K $MEME staked, 30 days locked.
            </p>
          </div>
        </details>
      </div>

      <div className="max-w-4xl w-full mt-8">
        <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Top 10 Stakers
        </h2>
        {loadingStakers ? (
          <div className="text-center">
            <LoadingSkeleton />
            <p className="text-gray-300 mt-2">Loading top stakers...</p>
          </div>
        ) : topStakers.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            No stakers found yet. Be the first to stake!
          </p>
        ) : (
          <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Wallet Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Staked ($MEME)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Reward ($MEMEFRENZY)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    ROI (%)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {topStakers.map((staker, index) => {
                  const roi = (staker.rewardAmount / staker.stakedAmount) * 100;
                  return (
                    <tr
                      key={staker._id || staker.walletAddress}
                      className="hover:bg-gray-750/60 transition-colors duration-150"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {index + 1}
                      </td>
                      <td
                        className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-300"
                        title={staker.walletAddress}
                      >
                        {`${staker.walletAddress.substring(
                          0,
                          6
                        )}...${staker.walletAddress.substring(
                          staker.walletAddress.length - 6
                        )}`}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                        {Number(staker.stakedAmount || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-400">
                        {Number(staker.rewardAmount || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-400">
                        {roi.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Airdrop;

