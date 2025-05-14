// src/pages/Admin/AirdropClaimDetails.jsx
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CONFIG } from '../../config';
import LoadingSkeleton from '../../components/LoadingSkeleton';


const AirdropClaimDetails = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchClaimDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/admin/airdrops/claim/${claimId}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
            toast.error('Session expired or unauthorized. Redirecting to login.');
            document.cookie = 'adminJwt=; Max-Age=0; path=/; SameSite=Lax';
            navigate('/admin/login', {replace: true});
            return;
        }
        const errorData = await res.json().catch(() => ({ message: 'Failed to load claim details.' }));
        throw new Error(errorData.message || `Failed to load claim details. Status: ${res.status}`);
      }
      const data = await res.json();
      setClaim(data);
      
    } catch (err) {
      console.error('Fetch claim details error:', err);
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [claimId, navigate]);

  useEffect(() => {
    if (claimId) {
      fetchClaimDetails();
    }
  }, [claimId, fetchClaimDetails]);


  


  if (loading) return <div className="p-8 bg-gray-900 min-h-screen"><LoadingSkeleton /></div>;
  if (error) return <div className="p-8 bg-gray-900 min-h-screen text-red-400 text-center">{error}</div>;
  if (!claim) return <div className="p-8 bg-gray-900 min-h-screen text-center text-gray-400">Claim not found.</div>;

  const detailItemClass = "py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0";
  const dtClass = "text-sm font-medium leading-6 text-gray-400";
  const ddClass = "mt-1 text-sm leading-6 text-white sm:col-span-2 sm:mt-0";

  

  return (
    <div className="p-4 md:p-8 bg-gray-900 min-h-screen text-gray-200">
      <div className="max-w-3xl mx-auto ">
        <div className="mb-6">
          <Link 
            to="/admin/airdrops" 
            className="text-sm text-purple-400 hover:text-purple-300 inline-flex items-center group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Airdrops List
          </Link>
        </div>

        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden p-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
            <h3 className="text-xl leading-6 font-semibold text-white">
              Airdrop Claim Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-400">
              Claim ID: <span className="font-mono text-purple-400">{claim._id}</span>
            </p>
          </div>
          <div className="border-t border-gray-700 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-700">
              <div className={detailItemClass}>
                <dt className={dtClass}>Wallet Address</dt>
                <dd className={`${ddClass} font-mono`}>{claim.walletAddress}</dd>
              </div>
              <div className={detailItemClass}>
                <dt className={dtClass}>Transaction ID (txId)</dt>
                <dd className={`${ddClass} font-mono break-all`}>
                  <a href={`https://solscan.io/tx/${claim.txId}?cluster=mainnet-beta`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                    {claim.txId}
                  </a>
                </dd>
              </div>
              <div className={detailItemClass}>
                <dt className={dtClass}>Staked Amount ($MEME)</dt>
                <dd className={ddClass}>{Number(claim.stakedAmount).toFixed(2)}</dd>
              </div>
              <div className={detailItemClass}>
                <dt className={dtClass}>Lock Duration (Days)</dt>
                <dd className={ddClass}>{Number(claim.lockDurationDays).toFixed(1)}</dd>
              </div>
              <div className={detailItemClass}>
                <dt className={dtClass}>Calculated Airdrop ($MEME)</dt>
                <dd className={`${ddClass} text-purple-400 font-bold`}>{Number(claim.rewardAmount).toFixed(2)}</dd>
              </div>
              <div className={detailItemClass}>
                <dt className={dtClass}>Claim Submitted At</dt>
                <dd className={ddClass}>{new Date(claim.createdAt).toLocaleString()}</dd>
              </div>
              <div className={detailItemClass}>
                <dt className={dtClass}>Last Updated At</dt>
                <dd className={ddClass}>{new Date(claim.updatedAt).toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirdropClaimDetails;