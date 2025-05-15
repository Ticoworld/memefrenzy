import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";

const Hero = () => {
  const contractAddress = "94fzsMkuHAuFP4J8iMZS43euWr2CLtuvwLgyjPHyqcnY";

  // Function to copy the contract address to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: "Contract Address copied to clipboard.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
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
          <span className="text-yellow-500">Memefrenzy</span>
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Join the most exciting meme-based crypto community on Solana. Laugh,
          engage, and earn!
        </p>

        <div className="flex justify-center gap-6 mb-6 flex-wrap">
          {/* Join the Community button */}
          <a
            href="https://t.me/memefrenzysol"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-md text-lg"
          >
            Join the Community
          </a>

          {/* Buy Now button */}
          <a
            href="https://raydium.io/swap/?inputMint=So11111111111111111111111111111111111111112&outputMint=94fzsMkuHAuFP4J8iMZS43euWr2CLtuvwLgyjPHyqcnY"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-md text-lg"
          >
            Buy Now
          </a>

          {/* New Stake Now button */}
          <a
            href="https://app.streamflow.finance/staking/solana/mainnet/4z4axj8d5FPscw3ZxGW6xqPnmwLtrqYJTYMLDqv4hRf9"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-md text-lg"
          >
            Stake Now
          </a>
        </div>

        {/* Contract Address (CA) */}
        <div className="text-lg md:text-xl text-center">
          <p>Contract Address (CA):</p>
          <div className="flex justify-center items-center gap-2 mb-6">
            {/* Contract address box */}
            <div className="border-2 border-yellow-500 px-2 py-3 rounded-lg shadow-lg bg-gray-800 text-yellow-500 font-semibold flex items-center justify-between gap-2 text-[10px] md:text-xl sm:text-lg">
              <p>{contractAddress}</p>
              <button
                onClick={copyToClipboard}
                className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-2 rounded-md text-sm"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 animate-bounce-slow">
          <Link
            to="/airdrop"
            className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 relative group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              🪂 Claim Your MEME Airdrop!
            </span>
            <div className="absolute inset-0 bg-yellow-500/30 rounded-full filter blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          </Link>

          <p className="mt-4 text-yellow-300/80 text-sm font-medium">
            Earn up to 17% rewards • Limited time only •{" "}
            <span className="text-yellow-500">No minimum lock</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
