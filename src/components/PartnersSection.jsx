import React from 'react';

const PartnersSection = () => {
  const partners = [
    { name: 'Coinscope', role: 'Audit Partner', logo: '/scope.jpg' },
    { name: 'CoinGecko', role: 'Listing Partner', logo: '/gec.jpg' },
    { name: 'Solana', role: 'Blockchain Partner', logo: '/solana-sol.png' },
    { name: 'DexScreener', role: 'Analytics Partner', logo: '/dex.jpg' },
    { name: 'PinkSale', role: 'Launchpad Partner', logo: '/Pinksale.png', link: 'https://www.pinksale.finance/solana/launchpad/5d5DUZXuV4Hhsyvo9m9qZEu1SfYmYZuEyEjRGCKXNFmP' },
    { name: 'Dexview', role: 'Launchpad Partner', logo: '/dexview.png', link: 'https://dexview.com' },
    { name: 'StreamFlow', role: 'Staking Partner', logo: '/stream.jpg', link: 'https://app.streamflow.finance/staking/solana/mainnet/4z4axj8d5FPscw3ZxGW6xqPnmwLtrqYJTYMLDqv4hRf9'}
  ];

  return (
    <section id="partners" className="bg-black text-white py-16">
      <div className="container mx-auto px-5 md:px-32">
        <h2 className="text-4xl font-bold text-center mb-8">Our Partners</h2>
        <p className="text-center text-lg mb-12">
          We are proud to collaborate with industry leaders to bring the best experience to our community.
        </p>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <a
              key={index}
              href={partner.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center bg-gray-800 p-6 rounded-md hover:shadow-xl hover:bg-gray-700 transition duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-24 h-24 object-contain mb-4"
              />
              <h3 className="text-xl font-semibold">{partner.name}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
