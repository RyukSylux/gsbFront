import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 sm:pt-32 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Galaxy Swiss Bourdin
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              Leader dans l'industrie pharmaceutique, GSB est votre partenaire de confiance pour la gestion des frais professionnels et des notes de service.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/signup"
                className="rounded-md bg-[#2B84C3] px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-[#2472A8] transition-colors"
              >
                Commencer
              </Link>
              <Link
                to="/signin"
                className="text-lg font-semibold leading-6 text-gray-900 hover:text-[#2B84C3] transition-colors"
              >
                Se connecter <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="rounded-lg bg-[#2B84C3] bg-opacity-10 p-3">
                  <svg className="h-6 w-6 text-[#2B84C3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">Gestion Simplifiée</h3>
              <p className="mt-2 text-base text-gray-600">
                Une interface intuitive pour gérer vos notes de frais efficacement.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center">
                <div className="rounded-lg bg-[#2B84C3] bg-opacity-10 p-3">
                  <svg className="h-6 w-6 text-[#2B84C3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">Sécurité Optimale</h3>
              <p className="mt-2 text-base text-gray-600">
                Protection avancée de vos données et informations sensibles.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center">
                <div className="rounded-lg bg-[#2B84C3] bg-opacity-10 p-3">
                  <svg className="h-6 w-6 text-[#2B84C3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">Traitement Rapide</h3>
              <p className="mt-2 text-base text-gray-600">
                Validation et remboursement accélérés de vos notes de frais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              À propos de GSB
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
              Galaxy Swiss Bourdin (GSB) est née de la fusion entre le géant américain Galaxy et le conglomérat européen Swiss Bourdin. 
              Notre mission est de perpétuer et développer le savoir-faire pharmaceutique tout en modernisant nos processus de gestion.
            </p>
          </div>
        </div>
      </section>      <Footer />
    </div>
  );
};

export default Home;
