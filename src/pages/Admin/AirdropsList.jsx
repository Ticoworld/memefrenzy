import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { CONFIG } from '../../config';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import { Buffer } from 'buffer';

const connection = new Connection(CONFIG.QUICKNODE_API_KEY || CONFIG.SOLANA_RPC_URL, 'confirmed');
const BATCH_SIZE = 15; // You can adjust this

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.07.207-.07.431 0 .639C20.268 16.057 16.477 19 12 19c-4.478 0-8.268-2.943-9.542-7a1.012 1.012 0 010-.639z" />
  </svg>
);

const AirdropsList = () => {
  const [airdrops, setAirdrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDistributing, setIsDistributing] = useState(false);
  const [sort, setSort] = useState('newest');
  const [campaignStatus, setCampaignStatus] = useState(null); // { isActive: boolean, endDate: string }
  const [loadingCampaignStatus, setLoadingCampaignStatus] = useState(true);
  const navigate = useNavigate();
  const { publicKey, connected, signTransaction } = useWallet();

  const fetchAirdrops = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${CONFIG.API_BASE_URL}/api/admin/airdrops?sort=${sort}`,
        { credentials: 'include' }
      );
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          toast.error('Session expired or unauthorized. Redirecting to login.');
          document.cookie = 'adminJwt=; Max-Age=0; path=/; SameSite=Lax';
          navigate('/admin/login', { replace: true });
          return;
        }
        const errorData = await res.json().catch(() => ({ message: 'Failed to load airdrop claims' }));
        throw new Error(errorData.message || 'Failed to load airdrop claims');
      }
      const data = await res.json();
      const undistributed = data.filter(airdrop => !airdrop.distributed);
      setAirdrops(undistributed);
    } catch (error) {
      toast.error(error.message);
      console.error("Fetch airdrops error:", error);
    } finally {
      setLoading(false);
    }
  }, [sort, navigate]);

  const fetchCampaignStatus = useCallback(async () => {
    setLoadingCampaignStatus(true);
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/admin/campaign/status`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Failed to fetch campaign status' }));
        throw new Error(errData.error || 'Failed to fetch campaign status');
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

  useEffect(() => {
    fetchAirdrops();
    fetchCampaignStatus();
  }, [fetchAirdrops, fetchCampaignStatus]);

  const handleViewDetails = (airdrop) => {
    navigate(`/admin/airdrops/claim/${airdrop._id}`);
  };

  const distributeAirdrops = async () => {
    if (!connected || !publicKey || !signTransaction) {
      toast.error('Please connect your wallet and ensure it supports signing transactions.');
      return;
    }
    if (!airdrops.length) {
      toast.error('No claims to distribute.');
      return;
    }
    if (campaignStatus?.isActive === true) {
      toast.error('Campaign must be inactive to distribute airdrops. Please update campaign status in admin dashboard.');
      return;
    }
     if (campaignStatus === null || campaignStatus?.isActive === undefined) {
      toast.error('Campaign status is unknown. Cannot distribute.');
      return;
    }


    setIsDistributing(true);
    toast.loading('Preparing airdrop distribution...');
    let totalSuccessfullyProcessedClaims = 0;

    const batches = [];
    for (let i = 0; i < airdrops.length; i += BATCH_SIZE) {
      batches.push(airdrops.slice(i, i + BATCH_SIZE));
    }

    const tokenMint = new PublicKey(CONFIG.MEME_MINT_ADDRESS);
    let sourceAta;

    try {
      sourceAta = await getAssociatedTokenAddress(tokenMint, publicKey);
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to get admin token account: ' + (err.message || err.toString()));
      console.error('Error fetching source token account:', err);
      setIsDistributing(false);
      return;
    }

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const claimIdsInBatch = batch.map(airdrop => airdrop._id);
      let transaction;
      const maxRetries = 3; // Retries for blockhash expiry
      let attempt = 0;
      let success = false;

      while (attempt < maxRetries && !success) {
        try {
          toast.dismiss();
          toast.loading(`Processing batch ${i + 1} of ${batches.length}... Attempt ${attempt + 1}/${maxRetries}`);
          transaction = new Transaction();

          for (const airdrop of batch) {
            const recipientWalletAddress = new PublicKey(airdrop.walletAddress);
            const destinationAta = await getAssociatedTokenAddress(tokenMint, recipientWalletAddress);
            const rawAmount = airdrop.rewardAmount;
            const decimals = CONFIG.TOKEN_DECIMALS !== undefined ? CONFIG.TOKEN_DECIMALS : 6;
            const amountInSmallestUnit = BigInt(Math.floor(Number(rawAmount) * (10 ** decimals)));
            

            transaction.add(
              createTransferInstruction(
                sourceAta, destinationAta, publicKey, amountInSmallestUnit, [], TOKEN_PROGRAM_ID
              )
            );
          }

          const latestBlockhash = await connection.getLatestBlockhash('confirmed');
          transaction.recentBlockhash = latestBlockhash.blockhash;
          transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
          transaction.feePayer = publicKey;

          toast.dismiss();
          toast.loading(`Awaiting signature for batch ${i + 1}... (Attempt ${attempt + 1})`);
          const signedTx = await signTransaction(transaction);
          
          toast.dismiss();
          toast.loading(`Sending batch ${i + 1} to backend...`);
          const res = await fetch(`${CONFIG.API_BASE_URL}/api/admin/airdrop/distribute-batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ 
              serializedTx: Buffer.from(signedTx.serialize()).toString('base64'),
              claimIds: claimIdsInBatch 
            }),
          });

          toast.dismiss();
          const data = await res.json(); // Try to parse JSON always

          if (!res.ok) {
            // If error is blockhash related and we can retry, do so
            if (data.error && data.error.toLowerCase().includes('blockhash') && attempt < maxRetries - 1) {
                throw new Error('block height exceeded'); // Trigger retry logic
            }
            throw new Error(data.error || `Batch distribution failed with status ${res.status}`);
          }
          
          toast.success(`Batch ${i + 1}/${batches.length} processed! Tx: ${data.signature ? data.signature.substring(0,10) : 'N/A'}...`);
          
          if (data.warning) {
            toast.custom((t) => (
              <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-yellow-100 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                <div className="flex-1 w-0 p-4"><div className="flex items-start"><div className="ml-3 flex-1"><p className="text-sm font-medium text-yellow-800">Confirmation Warning</p><p className="mt-1 text-sm text-yellow-700">{data.warning} Please verify on-chain.</p></div></div></div>
                <div className="flex border-l border-yellow-200"><button onClick={() => toast.dismiss(t.id)} className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-yellow-600 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500">Close</button></div>
              </div>
            ), { duration: 10000 });
          }

          if (data.message && data.message.includes("recorded")) {
            const recordedMatch = data.message.match(/Successfully recorded (\d+)|recorded (\d+) claims/i);
            if (recordedMatch) {
                totalSuccessfullyProcessedClaims += parseInt(recordedMatch[1] || recordedMatch[2], 10);
            } else { totalSuccessfullyProcessedClaims += batch.length; }
          } else { totalSuccessfullyProcessedClaims += batch.length; }
          success = true; // Mark as successful to exit retry loop

        } catch (err) {
          attempt++;
          const errMessage = err.message || err.toString();
          if (errMessage.toLowerCase().includes('block height exceeded') && attempt < maxRetries) {
            console.warn(`Blockhash expired for batch ${i + 1}, retrying... Attempt ${attempt}/${maxRetries}`);
            toast.dismiss();
            toast.loading(`Retrying batch ${i + 1} (attempt ${attempt})... New blockhash will be fetched.`);
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // wait longer on subsequent retries
            continue; // Retry the while loop
          }
          toast.dismiss();
          toast.error(`Batch ${i + 1} processing failed: ` + errMessage);
          console.error(`Error distributing batch ${i + 1} after ${attempt} attempts:`, err);
          if (transaction && err.logs) {
            console.error("Failed Transaction Simulation Logs:", err.logs);
          } else if (transaction) {
            console.error("Failed transaction details (client-side build):", transaction.instructions.map(ix => ({
              programId: ix.programId.toBase58(),
              keys: ix.keys.map(k => ({ pubkey: k.pubkey.toBase58(), isSigner: k.isSigner, isWritable: k.isWritable })),
              data: ix.data.toString('hex')
            })));
          }
          setIsDistributing(false);
          fetchAirdrops();
          return; // Stop processing further batches if one fails definitively
        }
      } // End of while loop
      if (!success) { // If all retries for a batch failed
        console.error(`All ${maxRetries} attempts failed for batch ${i + 1}.`);
        toast.error(`All ${maxRetries} attempts failed for batch ${i + 1}. Moving to next batch if any, or stopping.`);
        // Depending on desired behavior, you might 'return' here to stop all batches,
        // or 'continue' to try the next batch (current behavior is to stop due to the 'return' in catch).
        // For safety, if a batch truly fails all retries, it's often good to stop and investigate.
         setIsDistributing(false);
         fetchAirdrops();
         return;
      }
    } // End of for loop (batches)
    toast.dismiss(); 

    if (totalSuccessfullyProcessedClaims > 0) {
      toast.success(`Airdrop distribution process complete. Attempted to record ${totalSuccessfullyProcessedClaims} claims. Please verify distributions on-chain.`);
    } else if (batches.length > 0) {
      toast.error('No claims were successfully processed in the distribution attempt.');
    } else {
      toast.info('No batches were prepared for distribution (no undistributed claims).');
    }
    setIsDistributing(false);
    fetchAirdrops();
  };

  return (
    <div className="p-4 md:p-8 bg-gray-900 min-h-screen text-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            to="/admin/dashboard" 
            className="text-sm text-purple-400 hover:text-purple-300 mb-2 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Airdrop Claim Management (Undistributed)</h1>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <select
                className="bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                value={sort}
                onChange={e => setSort(e.target.value)}
                disabled={isDistributing || loadingCampaignStatus}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !text-white !font-semibold !py-2 !px-4 !rounded-md !shadow-md" />
              <button
                onClick={distributeAirdrops}
                disabled={
                  !connected || 
                  !publicKey || 
                  !airdrops.length || 
                  loading || 
                  isDistributing || 
                  loadingCampaignStatus || 
                  campaignStatus === null || // Disabled if status not loaded
                  campaignStatus.isActive === true // Disabled if campaign is active
                }
                className={`bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md shadow-md transition-colors ${
                  (!connected || !publicKey || !airdrops.length || loading || isDistributing || loadingCampaignStatus || campaignStatus === null || campaignStatus.isActive === true) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title={
                  campaignStatus === null ? "Loading campaign status..." :
                  campaignStatus?.isActive === true ? "Campaign must be inactive to distribute" :
                  !airdrops.length ? "No claims to distribute" :
                  isDistributing ? "Distribution in progress..." :
                  "Distribute Airdrop"
                }
              >
                {isDistributing ? 'Distributing...' : `Distribute Airdrop${airdrops.length > 0 ? ` (${airdrops.length})` : ''}`}
              </button>
            </div>
          </div>
          {!loadingCampaignStatus && campaignStatus && (
            <p className={`mt-2 text-sm ${campaignStatus.isActive ? 'text-yellow-400' : 'text-green-400'}`}>
              Campaign is currently: <strong>{campaignStatus.isActive ? 'ACTIVE' : 'INACTIVE'}</strong>.
              {campaignStatus.isActive && ' Distributions are disabled.'}
              {!campaignStatus.isActive && ' Distributions are enabled.'}
            </p>
          )}
        </div>

        {(loading && airdrops.length === 0) || (isDistributing && airdrops.length === 0) || loadingCampaignStatus ? ( 
          <LoadingSkeleton />
        ) : airdrops.length === 0 ? (
          // ... (no claims message - unchanged) ...
           <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2zm3-10V3M19 6V3" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-white">No Undistributed Airdrop Claims</h3>
            <p className="mt-1 text-sm text-gray-400">
              All claims have been distributed or no claims have been submitted yet.
            </p>
          </div>
        ) : (
          // ... (table rendering - largely unchanged, ensure keys and formatting are fine) ...
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-x-auto">
            <table className="w-full min-w-[1024px]">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Wallet Address</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Staked ({CONFIG.MEME_MINT_ADDRESS ? `$${CONFIG.MEME_MINT_ADDRESS.substring(0,4)}..` : '$MEME'})</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Lock (Days)</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Airdrop Amount</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Claimed At</th>
                  <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {airdrops.map(airdrop => (
                  <tr key={airdrop._id} className="hover:bg-gray-750/60 transition-colors duration-150">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-mono text-gray-300" title={airdrop.walletAddress}>
                      {`${airdrop.walletAddress.substring(0, 6)}...${airdrop.walletAddress.substring(airdrop.walletAddress.length - 6)}`}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300">{Number(airdrop.stakedAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300">{Number(airdrop.lockDurationDays).toFixed(1)}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-purple-400 font-bold">
                      {Number(airdrop.rewardAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400">
                      {new Date(airdrop.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleViewDetails(airdrop)}
                          disabled={isDistributing}
                          className="text-blue-400 hover:text-blue-300 p-1.5 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                          title="View Details"
                        >
                          <EyeIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirdropsList;