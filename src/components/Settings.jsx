import React from 'react';

const Settings = () => {
  return (
    <div className="pt-6 border-t border-gray-200">
      <ul className="space-y-2">
        <li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Settings</li>
        <li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center">
          Open in browser
          <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </li>
      </ul>
    </div>
  );
};

export default Settings;
