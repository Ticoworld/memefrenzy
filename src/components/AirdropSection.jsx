import { Link } from 'react-router-dom';

const AirdropSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-6 border-2 border-yellow-500/30 transition-all duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent py-2">
             Memefrenzy Airdrop Campaign is Live!
          </h2>
          <p className="text-xl text-yellow-300 mb-6">
            Rewarding Our Loyal Community Champions
          </p>
        </div>

        <div className="mb-12 text-center">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-yellow-500/20 mb-8">
            <p className="text-lg text-gray-300 mb-4">
              "This is just the beginning - more community rewards coming soon!"
            </p>
            <p className="text-yellow-500 font-bold">
              Exclusive to Streamflow Stakers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* How It Works */}
            <div className="p-6 bg-gray-800/50 rounded-xl border border-yellow-500/20">
              <h3 className="text-2xl font-bold text-yellow-500 mb-4">
                🎯 Simple 4-Step Process
              </h3>
              <ol className="space-y-4 text-gray-300 text-left">
                <li className="flex items-start gap-3">
                  <span className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center">1</span>
                  Buy $MEME on Raydium
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center">2</span>
                  Stake on Streamflow
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center">3</span>
                  Submit TX Hash + Wallet Address
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center">4</span>
                  Receive Up to +17% Bonus
                </li>
              </ol>
            </div>

            {/* Key Benefits */}
            <div className="p-6 bg-gray-800/50 rounded-xl border border-yellow-500/20">
              <h3 className="text-2xl font-bold text-yellow-500 mb-4">
                💎 Your Rewards
              </h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 text-yellow-500">⚡</div>
                  <span>+17% Bonus on Staked Amount</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 text-yellow-500">🔒</div>
                  <span>Early Access to Future Drops</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 text-yellow-500">🎁</div>
                  <span>Exclusive Community Perks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Section */}
          <div className="bg-yellow-500/10 p-6 rounded-xl border border-yellow-500/30 mb-8">
            <h3 className="text-xl font-bold text-yellow-500 mb-2">
              ✅ Check Eligibility Now
            </h3>
            <p className="text-gray-300 mb-4">
              Already staked? Submit your details to claim your rewards
            </p>
            <Link
              to="/airdrop"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg text-md transition-all"
            >
              Submit Transaction Details →
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="mb-4">
            <a
              href="https://app.streamflow.finance/staking/solana/mainnet/4z4axj8d5FPscw3ZxGW6xqPnmwLtrqYJTYMLDqv4hRf9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-800 hover:bg-gray-700 text-yellow-500 border-2 border-yellow-500 font-bold py-3 px-6 rounded-lg transition-all"
            >
              Start Staking on Streamflow
            </a>
          </div>
          <p className="text-sm text-gray-400">
            Airdrop submissions close soon, so don't miss out!
          </p>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-yellow-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default AirdropSection;