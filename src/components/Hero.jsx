import React from "react";

const Hero = () => {
  // Function to copy the contract address to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText("0x1234567890abcdef1234567890abcdef12345678");
    alert("Contract Address Copied to Clipboard!");
  };

  return (
    <div
      className="relative bg-cover bg-center h-screen flex items-center justify-center text-center text-white"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      {/* Full-screen overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>

      {/* Content inside the overlay */}
      <div className="relative z-2 p-6 rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Ride the Meme Wave with{" "}
          <span className="text-yellow-500">Memefrenzy</span>!
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Join the most exciting meme-based crypto community on Solana. Laugh,
          engage, and earn!
        </p>

        <div className="flex justify-center gap-6 mb-6">
          {/* Join the Community button */}
          <a
            href="https://t.me/moonfrenzymeme"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-md text-lg"
          >
            Join the Community
          </a>

          {/* Buy Now button */}
          <a
            href="https://yourbuynowlink.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-md text-lg"
          >
            Buy Now
          </a>
        </div>

        {/* Contract Address (CA) */}
        <div className="text-lg md:text-xl text-center">
          <p>Contract Address (CA):</p>
          <div className="flex justify-center items-center gap-2 mb-6">
            {/* Contract address with styled border and shadow */}
            <div className="border-2 border-yellow-500 px-2 py-3 rounded-lg shadow-lg bg-gray-800 text-yellow-500 font-semibold flex items-center justify-between gap-2 text-sm">
              <p>94fzsMkuHAuFP4J8iMZS43euWr2CLtuvwLgyjPHyqcnY</p>
              <button
                onClick={copyToClipboard}
                className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-2 rounded-md text-sm"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
