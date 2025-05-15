import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <img 
          src="/logoGSB.png" 
          alt="GSB Logo" 
          className="h-16 w-auto mx-auto mb-4 animate-pulse"
        />
        <h2 className="text-xl font-semibold text-[#2B84C3] mb-2">
          Chargement...
        </h2>
        <p className="text-gray-600">
          Veuillez patienter pendant que nous chargeons vos informations
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
