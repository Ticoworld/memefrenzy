import React from 'react';

const Roadmap = () => {
  return (
    <section id="roadmap" className="bg-gray-900 text-white py-16"
    data-aos="fade-up"

    >
      <div className="container mx-auto px-6 md:px-16">
        <h2 className="text-4xl font-bold text-center mb-12">Roadmap</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Q1 2025 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Q1 2025</h3>
            <ul className="space-y-2">
              <li>Launch of Memefrenzy Token ($MEME) on Solana.</li>
              <li>Initial Meme Contest and Community Airdrop.</li>
              <li>Development of MemeDAO Governance Mechanism.</li>
            </ul>
          </div>

          {/* Q2 2025 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Q2 2025</h3>
            <ul className="space-y-2">
              <li>Launch of the Memefrenzy Meme Battle feature.</li>
              <li>Partnership with influencers and meme creators.</li>
              <li>Introduction of staking platform and rewards.</li>
            </ul>
          </div>

          {/* Q3 2025 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Q3 2025</h3>
            <ul className="space-y-2">
              <li>Integration with Solana-based NFT platforms (Solanart, Magic Eden).</li>
              <li>Launch of the Memefrenzy NFT Marketplace.</li>
              <li>Large-scale meme competitions and viral campaigns.</li>
            </ul>
          </div>

          {/* Q4 2025 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Q4 2025</h3>
            <ul className="space-y-2">
              <li>Expansion to other blockchains (Ethereum, Binance Smart Chain).</li>
              <li>Launch of the Memefrenzy Meme Festival.</li>
              <li>Further community-driven development.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
