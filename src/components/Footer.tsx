import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full flex justify-center mt-12">
      <div className="relative bg-white/60 backdrop-blur-lg border border-slate-200 shadow-inner shadow-gray-300 rounded-xl px-6 py-5 text-center max-w-lg w-full mx-4 sm:mx-0">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-32 bg-gradient-to-r from-blue-400 via-yellow-400 to-pink-500 rounded-full blur-md opacity-40 animate-pulse" />

        <p className="text-[13px] text-slate-600 tracking-wide">
          Designed by{' '}
          <a
            href="https://www.jayanth.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-700 hover:text-yellow-500 transition-all duration-300"
          >
            Donavalli Jayanth
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
