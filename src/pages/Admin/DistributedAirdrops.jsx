import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { CONFIG } from '../../config';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const DistributedAirdrops = () => {
  const [distributedAirdrops, setDistributedAirdrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const navigate = useNavigate();

  const fetchDistributedAirdrops = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${CONFIG.API_BASE_URL}/api/admin/distributed-airdrops?sort=${sort}`,
        { credentials: 'include' }
      );
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          toast.error('Session expired or unauthorized. Redirecting to login.');
          document.cookie = 'adminJwt=; Max-Age=0; path=/; SameSite=Lax';
          navigate('/admin/login', { replace: true });
          return;
        }
        const errorData = await res.json().catch(() => ({ message: 'Failed to load distributed airdrops' }));
        throw new Error(errorData.message || 'Failed to load distributed airdrops');
      }
      const data = await res.json();
      setDistributedAirdrops(data);
    } catch (error) {
      toast.error(error.message);
      console.error("Fetch distributed airdrops error:", error);
    } finally {
      setLoading(false);
    }
  }, [sort, navigate]);

  useEffect(() => {
    fetchDistributedAirdrops();
  }, [fetchDistributedAirdrops]);

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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Distributed Airdrops</h1>
            <select
              className="bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : distributedAirdrops.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2zm3-10V3M19 6V3" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-white">No Distributed Airdrops</h3>
            <p className="mt-1 text-sm text-gray-400">
              No airdrops have been distributed yet.
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-x-auto">
            <table className="w-full min-w-[1024px]">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Wallet Address</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Staked ($MEME)</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Lock (Days)</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Reward ($MEMEFRENZY)</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Distributed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {distributedAirdrops.map(airdrop => (
                  <tr key={airdrop._id} className="hover:bg-gray-750/60 transition-colors duration-150">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-mono text-gray-300" title={airdrop.walletAddress}>
                      {`${airdrop.walletAddress.substring(0, 6)}...${airdrop.walletAddress.substring(airdrop.walletAddress.length - 6)}`}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300">{Number(airdrop.claimId?.stakedAmount || 0).toFixed(2)}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-300">{Number(airdrop.claimId?.lockDurationDays || 0).toFixed(1)}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-purple-400 font-bold">
                      {Number(airdrop.rewardAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400">
                      {new Date(airdrop.distributedAt).toLocaleString()}
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

export default DistributedAirdrops;