import React from 'react';
import SearchBar from './SearchBar';
import Navigation from './Navigation';
import Settings from './Settings';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 p-6 flex flex-col
        transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <button
          className="absolute top-4 right-4 lg:hidden"
          onClick={onClose}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-purple-600 rounded-lg mr-2"></div>
          <span className="text-xl font-semibold">GSB</span>
        </div>
        
        <SearchBar />
        <Navigation />
        <Settings />
      </aside>
    </>
  );
};

export default Sidebar;
