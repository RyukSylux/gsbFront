import React from 'react';
import SearchBar from '../ui/SearchBar';
import Navigation from './Navigation';
import Settings from '../settings/Settings';

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
        w-64 bg-white border-r border-gray-200 p-6 flex flex-col
        transform transition-transform duration-200 ease-in-out
        fixed lg:static inset-y-0 left-0 z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="lg:mb-6">
          <div className="flex items-center justify-between mb-6 sticky top-0 lg:relative bg-white z-10">
            <img
              src="/logoGSB.png"
              alt="Galaxy Swiss Bourdin"
              className="h-8 lg:hidden"
            />
            <button
              className="lg:hidden"
              onClick={onClose}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <SearchBar />
        </div>
        
        <Navigation />
        <Settings />
      </aside>
    </>
  );
};

export default Sidebar;
