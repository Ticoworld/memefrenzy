import React, { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-black text-white sm:px-32 px-5 py-2 flex justify-between items-center sticky top-0 z-10">
      {/* Logo */}
      <div className="text-2xl font-bold">Memefrenzy</div>

      {/* Menu for larger screens */}
      <ul className="hidden md:flex space-x-6">
        <li><a href="#home" className="hover:text-yellow-500">Home</a></li>
        <li><a href="#about" className="hover:text-yellow-500" >About</a></li>
        <li><a href="#tokenomics" className="hover:text-yellow-500">Tokenomics</a></li>
        <li><a href="#roadmap" className="hover:text-yellow-500">Roadmap</a></li>
        <li><a href="#faq" className="hover:text-yellow-500">FAQ</a></li>
      </ul>

      {/* "Buy $MEME" Button */}
      <button
        onClick={() => window.location.href = "#"} // Replace with your actual link
        className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md hidden md:block"
      >
        Buy $MEME
      </button>

      {/* Hamburger Menu for smaller screens */}
      <button
        onClick={() => window.location.href = "#"} 
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md md:hidden font-semibold"
      >
        BUY $MEME
      </button>
      <button
        onClick={handleMenuToggle}
        className="md:hidden text-white text-2xl focus:outline-none"
      >
        ☰
      </button>

      {/* Dropdown Menu for smaller screens */}
      {isMenuOpen && (
        <div className="absolute top-12 left-0 w-full bg-black text-white shadow-lg md:hidden z-[100]">
          <ul className="flex flex-col space-y-4 py-4 px-6">
            <li><a href="#home" className="hover:text-yellow-500" onClick={() => setIsMenuOpen(false)}>Home</a></li>
            <li><a href="#about" className="hover:text-yellow-500" onClick={() => setIsMenuOpen(false)}>About</a></li>

            <li><a href="#tokenomics" className="hover:text-yellow-500" onClick={() => setIsMenuOpen(false)}>Tokenomics</a></li>
            <li><a href="#roadmap" className="hover:text-yellow-500" onClick={() => setIsMenuOpen(false)}>Roadmap</a></li>
            <li><a href="#faq" className="hover:text-yellow-500" onClick={() => setIsMenuOpen(false)}>FAQ</a></li>
            <button
              onClick={() => window.location.href = "#"} // Replace with your actual link
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md"
            >
              Buy $MEME
            </button>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;