import React, { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-black text-white md:px-32  sm:px-8 px-5 py-2 flex justify-between items-center sticky top-0 z-10 gap-5">
      <div className="text-2xl font-bold">Memefrenzy</div>

      <ul className="hidden md:flex space-x-6">
        <li><a href="#home" className="hover:text-yellow-500">Home</a></li>
        <li><a href="#about" className="hover:text-yellow-500">About</a></li>
        <li><a href="#tokenomics" className="hover:text-yellow-500">Tokenomics</a></li>
        <li><a href="#roadmap" className="hover:text-yellow-500">Roadmap</a></li>
        <li><a href="#faq" className="hover:text-yellow-500">FAQ</a></li>
      </ul>

      <a
        href="https://raydium.io/swap/?inputMint=So11111111111111111111111111111111111111112&outputMint=94fzsMkuHAuFP4J8iMZS43euWr2CLtuvwLgyjPHyqcnY"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-2 rounded-md hidden md:block "
      >
        Buy $MEME
      </a>

      <a
              href="https://raydium.io/swap/?inputMint=So11111111111111111111111111111111111111112&outputMint=94fzsMkuHAuFP4J8iMZS43euWr2CLtuvwLgyjPHyqcnY"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-2 rounded-md md:hidden font-semibold"
      >
        BUY $MEME
      </a>
      <button
        onClick={handleMenuToggle}
        className="md:hidden text-white text-2xl focus:outline-none"
      >
        ☰
      </button>
      
      {isMenuOpen && (
        <div className="absolute top-12 left-0 w-full bg-black text-white shadow-lg md:hidden z-[100]">
          <ul className="flex flex-col space-y-4 py-4 px-6">
            <li><a href="#home" className="hover:text-yellow-500" onClick={() => setIsMenuOpen(false)}>Home</a></li>
            <li><a href="#about" className="hover:text-yellow-500" onClick={() => setIsMenuOpen(false)}>About</a></li>
            <li><a href="#tokenomics" className="hover:text-yellow-500" onClick={() => setIsMenuOpen(false)}>Tokenomics</a></li>
            <li><a href="#roadmap" className="hover:text-yellow-500" onClick={() => setIsMenuOpen(false)}>Roadmap</a></li>
            <li><a href="#faq" className="hover:text-yellow-500" onClick={() => setIsMenuOpen(false)}>FAQ</a></li>
            <a
              href="https://raydium.io/swap/?inputMint=So11111111111111111111111111111111111111112&outputMint=94fzsMkuHAuFP4J8iMZS43euWr2CLtuvwLgyjPHyqcnY"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-2 rounded-md text-center"
            >
              Buy $MEME
            </a>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
