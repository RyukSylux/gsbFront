import React from 'react';
import { Link } from 'react-router-dom';

const SignIn = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">Connexion</h1>
        <p className="text-gray-600 mb-6">Bienvenue ! Veuillez vous connecter à votre compte.</p>
        <form>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Entrez votre email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium text-gray-700">Mot de passe</label>
              <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                Mot de passe oublié ?
              </Link>
            </div>
            <input
              type="password"
              placeholder="Entrez votre mot de passe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Se connecter
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Pas encore de compte ?{" "}
          <Link to="/" className="text-indigo-600 hover:text-indigo-500 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
