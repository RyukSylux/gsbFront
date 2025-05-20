import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Bouton Menu (Mobile) */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2B84C3]"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Ouvrir le menu</span>
            <svg 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>

          {/* Logo et titre (caché sur mobile) */}
          <div className="hidden lg:flex lg:items-center">
            <img 
              src="/logoGSB.png" 
              alt="GSB Logo" 
              className="h-12 w-auto mr-2"
            />
            <span className="text-xl font-semibold text-[#2B84C3]">GSB</span>
          </div>

          {/* Informations utilisateur */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex sm:items-center sm:space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </span>
                <span className="text-gray-300">&bull;</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex flex-shrink-0 items-center space-x-2">
                  <div className="relative">
                    <div className="h-9 w-9 rounded-full bg-[#2B84C3] flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
                  </div>
                  <div className="hidden sm:flex sm:flex-col sm:items-start">
                    <span className="text-sm font-medium text-gray-900">
                      {user?.name || 'Utilisateur'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user?.email || ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
