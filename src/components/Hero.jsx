import React, { useState, useEffect } from "react";
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

  // Set the countdown target time (1 day, 16 hrs, 50 mins from now)
  const targetTime = new Date();
  targetTime.setDate(targetTime.getDate() + 1);
  targetTime.setHours(targetTime.getHours() + 16);
  targetTime.setMinutes(targetTime.getMinutes() + 50);
  targetTime.setSeconds(targetTime.getSeconds());

  // State to store the remaining time
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // Function to calculate the remaining time
  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = targetTime - now;

    if (difference <= 0) {
      return { expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  }

  // Effect to update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

        {/* Countdown Timer */}
        <div className="text-2xl font-bold mb-6">
          {timeLeft.expired ? (
            <span className="text-green-500 text-3xl">🚀 Presale is Live! 🚀</span>
          ) : (
            <p>
              Presale starts in:{" "}
              <span className="text-yellow-500">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </span>
            </p>
          )}
        </div>

        <div className="flex justify-center gap-6 mb-6">
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
            href="#"
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
      </div>
    </div>
  );
};

export default Hero;
