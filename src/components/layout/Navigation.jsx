import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="flex-1">
      <ul className="space-y-2">
        <Link to="/"><li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Accueil</li></Link>
        <Link to="/dashboard"><li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Tableau de bord</li></Link>
        <li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Projets</li>
        <li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Tâches</li>
        <li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Rapports</li>
        <li className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Utilisateurs</li>
      </ul>
    </nav>
  );
};

export default Navigation;
