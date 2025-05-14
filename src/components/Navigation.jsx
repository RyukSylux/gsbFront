import React from 'react';

const Navigation = () => {
  return (
    <nav className="flex-1">
      <ul className="space-y-2">
        <li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Home</li>
        <li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Dashboard</li>
        <li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Projects</li>
        <li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Tasks</li>
        <li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Reporting</li>
        <li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Users</li>
      </ul>
    </nav>
  );
};

export default Navigation;
