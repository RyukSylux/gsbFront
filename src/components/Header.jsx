import React from 'react';

const Header = ({ onMenuClick, pageTitle, userName }) => {
  return (
    <header className="mb-8">
      <div className="flex items-center mb-4">
        <button
          className="mr-4 text-gray-600 lg:hidden"
          onClick={onMenuClick}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center">
          <img 
            src="/logoGSB.png" 
            alt="GSB Logo" 
            className="h-8 w-auto mr-3 hidden md:block"
          />
          <nav className="flex text-gray-500 text-sm">
            <span className="mr-2">{userName}</span>
            <span className="mx-2">/</span>
            <span>Tableau de bord</span>
          </nav>
        </div>
      </div>
      <h1 className="text-2xl font-semibold mb-4 text-[#2B84C3]">{pageTitle}</h1>
    </header>
  );
};

export default Header;
