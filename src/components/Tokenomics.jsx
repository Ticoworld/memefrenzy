import React from 'react';

const Tokenomics = () => {
  return (
    <section id="tokenomics" className="bg-black text-white py-16"
    data-aos="fade-up"
    >
      <div className="px-5 md:px-32">
        <h2 className="text-4xl font-bold text-center  mb-8">Tokenomics</h2>
        <p className="text-center  text-lg mb-8">
          Here's how the $FRENZY token supply is distributed to maximize growth, sustainability, and a fair launch.
        </p>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-5">
        {/* Left Side Content */}
        <div className="w-full md:w-1/2">
          <div className="flex flex-col justify-between gap-4">
            <div className="bg-gray-800 p-6 rounded-md text-center w-full">
              <h3 className="text-xl font-semibold mb-2">Total Supply</h3>
              <p className="text-yellow-500 text-2xl font-bold">1,000,000,000</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-md text-center w-full">
              <h3 className="text-xl font-semibold mb-2">Presale</h3>
              <p className="text-yellow-500 text-2xl font-bold">0.5% (5,000,000)</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-md text-center w-full">
              <h3 className="text-xl font-semibold mb-2">Staking</h3>
              <p className="text-yellow-500 text-2xl font-bold">5% (50,000,000)</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-md text-center w-full">
              <h3 className="text-xl font-semibold mb-2">Liquidity</h3>
              <p className="text-yellow-500 text-2xl font-bold">20% (200,000,000)</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-md text-center w-full">
              <h3 className="text-xl font-semibold mb-2">Marketing</h3>
              <p className="text-yellow-500 text-2xl font-bold">13% (130,000,000)</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-md text-center w-full">
              <h3 className="text-xl font-semibold mb-2">Team</h3>
              <p className="text-yellow-500 text-2xl font-bold">7% (70,000,000)</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-md text-center w-full">
              <h3 className="text-xl font-semibold mb-2">Community Engagement & Partnerships</h3>
              <p className="text-yellow-500 text-2xl font-bold">5% (50,000,000)</p>
            </div>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <img 
            src="/logo.jpg" 
            alt="Tokenomics Image" 
            className="w-full h-auto rounded-lg shadow-lg" 
          />
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;
