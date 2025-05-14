import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DashboardCard from "../../components/DashboardCard";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import { CONFIG } from "../../config";
import { Buffer } from "buffer";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

window.Buffer = Buffer;

const connection = new Connection(
  CONFIG.QUICKNODE_API_KEY || CONFIG.SOLANA_RPC_URL,
  "confirmed"
);
const BATCH_SIZE = 15;

const useAdminAuth = () => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const lastCheck = useRef(0);

  const logout = useCallback(async () => {
    try {
      toast.loading("Logging out...");
      await fetch(`${CONFIG.API_BASE_URL}/api/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed: " + err.message);
    } finally {
      toast.dismiss();
      setAdmin(null);
      localStorage.removeItem("metrics");
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  const checkSession = useCallback(async () => {
    const now = Date.now();
    if (now - lastCheck.current < 30000) return;
    lastCheck.current = now;

    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/admin/me`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Session invalid");
      const data = await res.json();
      setAdmin(data);
    } catch (err) {
      document.cookie = "adminJwt=; Max-Age=0; path=/; SameSite=None";
      setAdmin(null);
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    let active = true;
    const init = async () => {
      setIsLoading(true);
      await checkSession();
      if (active) setIsLoading(false);
    };
    init();
    const interval = setInterval(
      () => active && checkSession(),
      15 * 60 * 1000
    );
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [checkSession]);

  return { admin, isLoading, logout };
};

const AdminDashboard = () => {
  const { admin, isLoading: isAdminLoading, logout } = useAdminAuth();
  const { publicKey, connected, signTransaction } = useWallet();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [campaignStatus, setCampaignStatus] = useState(null);
  const [newEndDate, setNewEndDate] = useState("");
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [claims, setClaims] = useState([]);
  const [distributing, setDistributing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [loadingCampaignStatus, setLoadingCampaignStatus] = useState(true);
  const lastFetch = useRef(0);

  const stableAdmin = useMemo(() => admin, [admin]);

  const retry = async (fn, attempts = 3, delay = 1000) => {
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (err) {
        if (err.message.includes("429") && i < attempts - 1) {
          await new Promise((r) => setTimeout(r, delay * Math.pow(2, i)));
        } else {
          throw err;
        }
      }
    }
  };

  const fetchMetrics = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetch.current < 30000) return;
    lastFetch.current = now;

    if (!stableAdmin || isAdminLoading) return;

    setLoadingMetrics(true);
    try {
      const res = await retry(() =>
        fetch(`${CONFIG.API_BASE_URL}/api/admin/metrics`, {
          credentials: "include",
        })
      );
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const data = await res.json();
      setMetrics(data);
      localStorage.setItem(
        "metrics",
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (err) {
      toast.error("Failed to fetch metrics: " + err.message);
      setMetrics(null);
    } finally {
      setLoadingMetrics(false);
    }
  }, [stableAdmin, isAdminLoading]);

  const fetchCampaignStatus = useCallback(async () => {
    setLoadingCampaignStatus(true);
    try {
      const res = await fetch(
        `${CONFIG.API_BASE_URL}/api/admin/campaign/status`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) {
        const errData = await res
          .json()
          .catch(() => ({ error: "Failed to fetch campaign status" }));
        throw new Error(errData.error || "Failed to fetch campaign status");
      }
      const data = await res.json();
      setCampaignStatus(data);
    } catch (err) {
      toast.error(err.message);
      console.error("Fetch campaign status error:", err);
      setCampaignStatus(null); // Set to null on error to ensure button is disabled
    } finally {
      setLoadingCampaignStatus(false);
    }
  }, []);

  const fetchClaims = useCallback(async () => {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/admin/airdrops`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch claims");
      const data = await res.json();
      const undistributed = data.filter((claim) => !claim.distributed);
      setClaims(undistributed);
    } catch (err) {
      toast.error("Failed to fetch claims: " + err.message);
    }
  }, []);

  const toggleCampaignStatus = async () => {
    try {
      const res = await fetch(
        `${CONFIG.API_BASE_URL}/api/admin/campaign/toggle`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to toggle campaign status");
      const data = await res.json();
      setCampaignStatus(data);
      toast.success(`Campaign is now ${data.isActive ? "active" : "inactive"}`);
    } catch (err) {
      toast.error("Failed to toggle campaign status");
    }
  };

  const updateCampaignEndDate = async () => {
    if (!newEndDate) {
      toast.error("Please select a valid date");
      return;
    }

    try {
      const res = await fetch(
        `${CONFIG.API_BASE_URL}/api/admin/campaign/update-end-date`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ endDate: newEndDate }),
        }
      );
      if (!res.ok) throw new Error("Failed to update campaign end date");
      const data = await res.json();
      setCampaignStatus(data);
      toast.success("Campaign end date updated successfully");
    } catch (err) {
      toast.error("Failed to update campaign end date");
    }
  };

  const distributeAirdrops = async () => {
    if (!connected || !publicKey || !signTransaction) {
      toast.error(
        "Please connect your wallet and ensure it supports signing transactions."
      );
      return;
    }
    if (!claims.length) {
      toast.error("No claims to distribute");
      return;
    }

    setDistributing(true);
    toast.loading("Preparing airdrop distribution...");
    let totalSuccessfullyProcessedClaims = 0;

    const batches = [];
    for (let i = 0; i < claims.length; i += BATCH_SIZE) {
      batches.push(claims.slice(i, i + BATCH_SIZE));
    }
    setProgress({ current: 0, total: batches.length });

    const tokenMint = new PublicKey(CONFIG.MEME_MINT_ADDRESS);
    let sourceAta;

    try {
      sourceAta = await getAssociatedTokenAddress(tokenMint, publicKey);
    } catch (err) {
      toast.dismiss();
      toast.error(
        "Failed to get admin token account: " + (err.message || err.toString())
      );
      console.error("Error fetching source token account:", err);
      setDistributing(false);
      return;
    }

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const claimIdsInBatch = batch.map((claim) => claim._id);
      let transaction;

      const maxRetries = 3;
      let attempt = 0;
      let success = false;

      while (attempt < maxRetries && !success) {
        try {
          toast.dismiss();
          toast.loading(
            `Processing batch ${i + 1} of ${batches.length}... Attempt ${
              attempt + 1
            }/${maxRetries}`
          );
          transaction = new Transaction();

          for (const claim of batch) {
            const recipientWalletAddress = new PublicKey(claim.walletAddress);
            const destinationAta = await getAssociatedTokenAddress(
              tokenMint,
              recipientWalletAddress
            );

            const rawAmount = claim.rewardAmount;
            const decimals =
              CONFIG.TOKEN_DECIMALS !== undefined ? CONFIG.TOKEN_DECIMALS : 6;
            const amountInSmallestUnit = BigInt(
              Math.floor(Number(rawAmount) * 10 ** decimals)
            );

            transaction.add(
              createTransferInstruction(
                sourceAta,
                destinationAta,
                publicKey,
                amountInSmallestUnit,
                [],
                TOKEN_PROGRAM_ID
              )
            );
          }

          const latestBlockhash = await connection.getLatestBlockhash(
            "confirmed"
          );
          transaction.recentBlockhash = latestBlockhash.blockhash;
          transaction.lastValidBlockHeight =
            latestBlockhash.lastValidBlockHeight;
          transaction.feePayer = publicKey;

          toast.dismiss();
          toast.loading(`Awaiting signature for batch ${i + 1}...`);
          const signedTx = await signTransaction(transaction);

          toast.dismiss();
          toast.loading(`Sending batch ${i + 1} to backend...`);
          const res = await fetch(
            `${CONFIG.API_BASE_URL}/api/admin/airdrop/distribute-batch`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                serializedTx: Buffer.from(signedTx.serialize()).toString(
                  "base64"
                ),
                claimIds: claimIdsInBatch,
              }),
            }
          );

          toast.dismiss();
          if (!res.ok) {
            const errorData = await res
              .json()
              .catch(() => ({ error: `Server error ${res.status}` }));
            throw new Error(
              errorData.error ||
                `Batch distribution failed with status ${res.status}`
            );
          }
          const data = await res.json();
          toast.success(
            `Batch ${i + 1}/${batches.length} confirmed! Tx: ${
              data.signature ? data.signature.substring(0, 10) : "N/A"
            }...`
          );
          if (data.message && data.message.includes("recorded")) {
            const recordedMatch = data.message.match(
              /Successfully recorded (\d+)/
            );
            if (recordedMatch && recordedMatch[1]) {
              totalSuccessfullyProcessedClaims += parseInt(
                recordedMatch[1],
                10
              );
            } else {
              totalSuccessfullyProcessedClaims += batch.length;
            }
          } else {
            totalSuccessfullyProcessedClaims += batch.length;
          }
          success = true;
          setProgress((prev) => ({ ...prev, current: i + 1 }));
        } catch (err) {
          attempt++;
          if (
            err.message.includes("block height exceeded") &&
            attempt < maxRetries
          ) {
            console.warn(
              `Blockhash expired for batch ${
                i + 1
              }, retrying... Attempt ${attempt}/${maxRetries}`
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
          }
          toast.dismiss();
          toast.error(
            `Batch ${i + 1} processing failed: ` +
              (err.message || err.toString())
          );
          console.error(`Error distributing batch ${i + 1}:`, err);
          if (transaction && err.logs) {
            console.error("Failed Transaction Simulation Logs:", err.logs);
          } else if (transaction) {
            console.error(
              "Failed transaction details (client-side build):",
              transaction.instructions.map((ix) => ({
                programId: ix.programId.toBase58(),
                keys: ix.keys.map((k) => ({
                  pubkey: k.pubkey.toBase58(),
                  isSigner: k.isSigner,
                  isWritable: k.isWritable,
                })),
                data: ix.data.toString("hex"),
              }))
            );
          }
          setDistributing(false);
          fetchMetrics();
          fetchClaims();
          return;
        }
      }
    }
    toast.dismiss();

    if (totalSuccessfullyProcessedClaims > 0) {
      toast.success(
        `Airdrop distribution process completed. Attempted to record ${totalSuccessfullyProcessedClaims} claims.`
      );
    } else if (batches.length > 0) {
      toast.error("No claims were processed in the distribution attempt.");
    } else {
      toast.info("No batches were prepared for distribution.");
    }
    setDistributing(false);
    fetchMetrics();
    fetchClaims();
  };

  useEffect(() => {
    if (!stableAdmin) return;
    const cache = JSON.parse(localStorage.getItem("metrics"));
    if (cache && Date.now() - cache.timestamp < 5 * 60 * 1000) {
      setMetrics(cache.data);
    } else {
      fetchMetrics();
    }
    fetchCampaignStatus();
    fetchClaims();
  }, [stableAdmin, fetchMetrics, fetchCampaignStatus, fetchClaims]);

  if (isAdminLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
        <LoadingSkeleton />
        <p className="mt-3 text-lg">Verifying admin session...</p>
      </div>
    );
  }

  if (!stableAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-xl md:text-2xl font-bold">
            Welcome, {stableAdmin.username}{" "}
            <span className="text-sm text-purple-400">
              ({stableAdmin.role})
            </span>
          </h1>
          <div className="flex gap-4">
            <WalletMultiButton className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md shadow-md transition-colors" />
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md shadow-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {campaignStatus && (
          <div className="mb-8 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Campaign Status</h2>
            <p>Status: {campaignStatus.isActive ? "Active" : "Inactive"}</p>
            <p>End Date: {new Date(campaignStatus.endDate).toLocaleString()}</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                onClick={updateCampaignEndDate}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow-md transition-colors"
              >
                Update End Date
              </button>
            </div>
            <button
              onClick={toggleCampaignStatus}
              className="mt-4 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md shadow-md transition-colors"
            >
              {campaignStatus.isActive ? "Disable Campaign" : "Enable Campaign"}
            </button>
          </div>
        )}

        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Airdrop Distribution</h2>
          <p>Pending Claims: {claims.length}</p>
          <button
            onClick={distributeAirdrops}
            disabled={
              distributing ||
              !connected ||
              !claims.length ||
              campaignStatus?.isActive
            }
            className={`mt-4 px-4 py-2 rounded-md shadow-md transition-colors ${
              distributing ||
              !connected ||
              !claims.length ||
              campaignStatus?.isActive
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {distributing
              ? `Distributing (${progress.current}/${progress.total})`
              : "Distribute Airdrops"}
          </button>
        </div>

        {loadingMetrics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(stableAdmin.role === "superadmin" ? 4 : 2)].map(
              (_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg h-32"
                ></div>
              )
            )}
          </div>
        ) : metrics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Airdrop Users"
              count={claims.length ?? "0"}
              action={() => navigate("/admin/airdrops")}
              icon={<CreditCardIcon />}
            />
            <DashboardCard
              title="Distributed Airdrops"
              count={metrics.distributedAirdrops ?? "0"}
              action={() => navigate("/admin/distributed-airdrops")}
              icon={<GiftIcon />}
            />
            {stableAdmin.role === "superadmin" && (
              <>
                <DashboardCard
                  title="Total Admins"
                  count={metrics.totalAdmins ?? "0"}
                  action={() => navigate("/admin/users")}
                  icon={<UsersIcon />}
                />
                <DashboardCard
                  title="Active Admins"
                  count={metrics.activeAdmins ?? "0"}
                  action={() => navigate("/admin/users")}
                  icon={<UsersIcon />}
                />
              </>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-10">
            Could not load dashboard metrics. Try refreshing.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

const CreditCardIcon = () => (
  <svg
    className="h-8 w-8 text-blue-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="h-8 w-8 text-green-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3"
    />
  </svg>
);

const GiftIcon = () => (
  <svg
    className="h-8 w-8 text-purple-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
    />
  </svg>
);
