import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/layout/Footer';
import axios from 'axios';

const SignIn = () => {
  const navigate = useNavigate();
  const { login, error, user } = useAuth();  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [magicEmail, setMagicEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);
  const [magicError, setMagicError] = useState('');
  const [magicLoading, setMagicLoading] = useState(false);

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);    try {
      await login(formData.email, formData.password, formData.rememberMe);
      // La redirection se fera automatiquement grâce au useEffect
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setFormError(err.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  // Magic link handlers
  const handleMagicLink = async (e) => {
    e.preventDefault();
    setMagicError('');
    setMagicSent(false);
    setMagicLoading(true);
    try {
      await axios.get(`/api/magic/?email=${encodeURIComponent(magicEmail)}`);
      setMagicSent(true);
    } catch (err) {
      setMagicError('Unable to send magic link. Please check your email.');
    } finally {
      setMagicLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-4 left-4">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-[#2B84C3] transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </Link>
        </div>
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-center mb-8">
            <img 
              src="/logoGSB.png" 
              alt="GSB Logo" 
              className="h-16 w-auto mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-[#2B84C3]">Connexion GSB</h1>
            <p className="text-gray-600">Bienvenue ! Veuillez vous connecter à votre compte.</p>
          </div>

          {(formError || error) && !showMagicLink && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {formError || error}
            </div>
          )}

          {/* Choix du mode de connexion */}
          <div className="flex justify-center mb-6 space-x-4">
            <button
              className={`px-4 py-2 rounded-md font-medium border ${!showMagicLink ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setShowMagicLink(false)}
              type="button"
            >
              Connexion Classique
            </button>
            <button
              className={`px-4 py-2 rounded-md font-medium border ${showMagicLink ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setShowMagicLink(true)}
              type="button"
            >
              Magic Link
            </button>
          </div>

          {/* Formulaire classique */}
          {!showMagicLink && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Entrez votre email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />            </div>
              <div className="mb-4">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Entrez votre mot de passe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>
          )}

          {/* Formulaire Magic Link */}
          {showMagicLink && (
            <form onSubmit={handleMagicLink}>
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={magicEmail}
                  onChange={e => setMagicEmail(e.target.value)}
                  placeholder="Entrez votre email pour recevoir un magic link"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={magicLoading}
                className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {magicLoading ? 'Envoi...' : 'Envoyer le Magic Link'}
              </button>
              {magicSent && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
                  Magic link envoyé ! Veuillez vérifier votre email.
                </div>
              )}
              {magicError && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                  {magicError}
                </div>
              )}
            </form>
          )}

          <p className="mt-4 text-center text-gray-600">
            Pas encore de compte ?{" "}
            <Link to="/signup" className="text-indigo-600 hover:text-indigo-500 hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;
