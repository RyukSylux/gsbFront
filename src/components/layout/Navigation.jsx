import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="flex-1">
      <ul className="space-y-2">
        <Link to="/"><li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Accueil</li></Link>
        <Link to="/dashboard"><li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Tableau de bord</li></Link>
        <Link to="/stats"><li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Statistiques</li></Link>
      </ul>
    </nav>
  );
};

export default Navigation;
