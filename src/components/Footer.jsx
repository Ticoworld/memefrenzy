import React from 'react';
import { FaTelegramPlane, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8" id='footer'
    data-aos="fade-up"
    >
      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo or Name */}
          <div className="text-2xl font-bold text-yellow-500">
            Memefrenzy
          </div>

          {/* Social Links */}
          <div className="flex space-x-6">
            <a
              href="https://x.com/moonfrenzysol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 hover:text-yellow-400 text-2xl"
            >
              <img src="/x.svg" alt="" />
            </a>
            <a
              href="https://t.me/moonfrenzymeme"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 text-5xl"
            >
              <FaTelegramPlane />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Memefrenzy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
