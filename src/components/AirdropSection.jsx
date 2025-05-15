import { Link } from 'react-router-dom';

const AirdropSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-6  border-2 border-yellow-500/30 transform hover:scale-[1.005] transition-all duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            🪂 Mega MEME Airdrop!
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            Lock $MEME, Earn More MEME - Turbocharge Your Holdings!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Eligibility Criteria */}
          <div className="p-6 bg-gray-800/50 rounded-xl border border-yellow-500/20">
            <h3 className="text-2xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Requirements
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Minimum 100,000 $MEME staked
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                30-day minimum lock period
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Wallet must be verified
              </li>
            </ul>
          </div>

          {/* Tier Display */}
          <div className="p-6 bg-gray-800/50 rounded-xl border border-yellow-500/20">
            <h3 className="text-2xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h3l2 4-2 4h-3M5 7h3l2 4-2 4H5" />
              </svg>
              Reward Tiers
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span>100K - 1M $MEME</span>
                <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-md">5%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span>1M - 5M $MEME</span>
                <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-md">10%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span>5M+ $MEME</span>
                <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-md">15%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Section */}
        <div className="text-center mb-12 p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/30 animate-pulse-slow">
          <h3 className="text-2xl font-bold text-yellow-500 mb-2">
            🚀 Long-Term Bonus
          </h3>
          <p className="text-gray-300">
            Lock for 90+ days and get +2% bonus! (Max 17% total rewards)
          </p>
          <div className="mt-4 text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            17% MAX APY
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/airdrop"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 relative group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Participate Now
            </span>
            <div className="absolute inset-0 bg-yellow-500/30 rounded-full filter blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          </Link>
          
          <p className="mt-4 text-gray-400 text-sm">
            Connect your wallet to check eligibility and available rewards
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