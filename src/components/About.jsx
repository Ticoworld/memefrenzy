import React from 'react';

const About = () => {
  return (
    <div
      className="bg-gray-800 py-12 px-6 md:px-12 text-white"
      data-aos="fade-up"
      id="about"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">About Memefrenzy</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Memefrenzy ($MEME) is not just another memecoin—it's a movement that fuses the funniest, most viral internet trends with the power of Solana blockchain. $MEME is here to bring memes, chaos, and community-driven fun to the forefront of crypto, creating a token for meme lovers and crypto enthusiasts alike.
        </p>
        <div className="flex justify-center mb-8">
          <img
            src="/logo.jpg"
            alt="Memefrenzy Image"
            className="w-full md:w-2/3 rounded-lg shadow-2xl"
          />
        </div>
        <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto">
          Join the chaos, fuel the fun, and become a part of the next big meme revolution in the crypto world with $MEME. Ready to be a part of something bigger? Let’s make memes that matter!
        </p>
        <a
          href="/white.pdf"
          download="Memefrenzy-Overview.pdf"
          className="inline-block text-lg text-yellow-200 hover:text-blue-300 font-semibold transition-colors"
        >
          Click below to download the overview
        </a>
      </div>
    </div>
  );
};

export default About;
