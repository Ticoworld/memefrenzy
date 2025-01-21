import React from 'react';

const Tokenomics = () => {
  // Tokenomics data as an array of objects
  const tokenData = [
    { title: 'Total Supply', value: '1,000,000,000 $MEME tokens (1 BILLION total supply)' },
    { title: 'Public Sale', value: '55% (550M $MEME)' },
    { title: 'Liquidity Pool', value: '25% (250M $MEME)' },
    { title: 'Staking', value: '5% (50M $MEME)' },
    { title: 'Marketing & Partnerships', value: '10% (100M $MEME)' },
    { title: 'Team', value: '5% (50M $MEME)' },
  ];

  return (
    <section id="tokenomics" className="bg-black text-white py-16" data-aos="fade-up">
      <div className="px-5 md:px-32">
        <h2 className="text-4xl font-bold text-center mb-8">Tokenomics</h2>
        <p className="text-center text-lg mb-8">
          Here's how the $MEME token supply is distributed to maximize growth, sustainability, and a fair launch.
        </p>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-5">
        {/* Left Side Content */}
        <div className="w-full md:w-1/2">
          <div className="flex flex-col justify-between gap-4">
            {tokenData.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-md text-center w-full"
              >
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-yellow-500 text-2xl font-bold">{item.value}</p>
              </div>
            ))}
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
