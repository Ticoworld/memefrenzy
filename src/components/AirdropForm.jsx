import { useWallet } from "@solana/wallet-adapter-react";
import PropTypes from 'prop-types';

export default function AirdropForm({
  walletAddress,
  stakeId,
  isLoading,
  error,
  isSubmitted,
  onStakeIdChange,
  onSubmit
}) {
  const { connect, connecting } = useWallet();

  return (
    <div 
      className="max-w-md w-full bg-gray-800 rounded-2xl p-8 shadow-xl"
      data-aos="fade-up"
    >
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        🎁 Claim Your $MEME Airdrop
      </h2>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Solana Wallet Address
          </label>
          {walletAddress ? (
            <div className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-300">
              {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
            </div>
          ) : (
            <button
              type="button"
              onClick={connect}
              disabled={connecting}
              className="w-full py-3 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
            >
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Streamflow Stake ID
          </label>
          <input
            type="text"
            value={stakeId}
            onChange={(e) => onStakeIdChange(e.target.value.trim())}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter stake transaction ID"
            disabled={isLoading || !walletAddress}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !walletAddress}
          className="w-full py-3 text-lg font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Claim Airdrop"}
        </button>

        {error && <p className="text-center text-red-400 mt-2">❌ {error}</p>}

        {!isSubmitted && !error && !isLoading && (
          <p className="text-center text-gray-400 text-sm mt-2">
            🔒 Stake must be locked ≥30 days to qualify
          </p>
        )}
      </form>

      {isSubmitted && (
        <p className="text-center text-green-400 mt-4">
          ✅ Success! Watch your wallet for the airdrop
        </p>
      )}
    </div>
  );
}

AirdropForm.propTypes = {
  walletAddress: PropTypes.string,
  stakeId: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  isSubmitted: PropTypes.bool,
  onStakeIdChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};