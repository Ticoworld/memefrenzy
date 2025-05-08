import React from 'react';

const StakingSection = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16 px-6 shadow-2xl border-2 border-yellow-500/30 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          <img 
            src="/stream.jpg" 
            alt="Streamflow Logo"
            className="w-32 h-32 object-contain animate-pulse-slow"
          />
          
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Stake $MEME, Earn More MEME!
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Partnering with <span className="text-yellow-500 font-bold">Streamflow</span>, we bring you 
              industry-leading staking solutions. Lock your tokens in our <span className="text-yellow-500">audited smart contracts</span> 
              and watch your holdings grow with:
            </p>
            
            <div className="flex justify-center md:justify-start gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">8-15%</div>
                <div className="text-sm text-gray-400">APY Returns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">Auto</div>
                <div className="text-sm text-gray-400">Compounding</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">Flexible</div>
                <div className="text-sm text-gray-400">Lock-ups</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://app.streamflow.finance/staking/solana/mainnet/4z4axj8d5FPscw3ZxGW6xqPnmwLtrqYJTYMLDqv4hRf9"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Staking Now
          </a>
          
          <p className="mt-4 text-gray-400 text-sm">
            Secured by Streamflow's audited smart contracts
            <br />
            <span className="text-yellow-500/80">No deposit fees • Instant withdrawals • 24/7 Support</span>
          </p>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">
          Powered by{" "}
          <a 
            href="https://streamflow.finance" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            Streamflow Finance
          </a>{" "}
          - Institutional-grade DeFi infrastructure
        </p>
      </div>
    </div>
  );
};

export default StakingSection;
