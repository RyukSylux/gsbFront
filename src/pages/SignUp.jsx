import React from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">Inscription</h1>
        <p className="text-gray-600 mb-6">Commencez votre période d'essai de 30 jours.</p>
        <form>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">Nom</label>
            <input
              type="text"
              placeholder="Entrez votre nom"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Entrez votre email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">Mot de passe</label>
            <input
              type="password"
              placeholder="Créez un mot de passe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <small className="text-gray-500 mt-1 block">Doit contenir au moins 8 caractères.</small>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Commencer
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Vous avez déjà un compte ?{" "}
          <Link to="/signin" className="text-indigo-600 hover:text-indigo-500 hover:underline">
            Connexion
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
