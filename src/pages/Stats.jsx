import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { authAPI } from '../services/api';
import { TableLoadingScreen } from '../components/ui/LoadingScreen';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Stats = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authAPI.getStats();
      setStats(data);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'paid': 
        return { label: 'Validé', color: '#10b981', gradient: 'from-emerald-500 to-teal-600' };
      case 'refunded': 
        return { label: 'Remboursé', color: '#4f46e5', gradient: 'from-blue-500 to-indigo-600' };
      case 'pending': 
        return { label: 'En attente', color: '#f59e0b', gradient: 'from-amber-400 to-orange-500' };
      case 'not-paid':
      case 'not paid': 
        return { label: 'Refusé', color: '#ef4444', gradient: 'from-rose-500 to-red-600' };
      default: 
        return { label: status, color: '#6b7280', gradient: 'from-gray-500 to-gray-600' };
    }
  };

  // Préparation des données pour les graphiques
  const statusData = stats.reduce((acc, curr) => {
    const status = curr._id.status;
    const existing = acc.find(item => item.name === status);
    if (existing) {
      existing.value += curr.totalAmount;
    } else {
      acc.push({ name: status, value: curr.totalAmount, label: getStatusInfo(status).label, color: getStatusInfo(status).color });
    }
    return acc;
  }, []);

  const categoryData = stats.reduce((acc, curr) => {
    const category = curr._id.category || 'Autre';
    const existing = acc.find(item => item.name === category);
    if (existing) {
      existing.value += curr.totalAmount;
    } else {
      acc.push({ name: category, value: curr.totalAmount });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);
  // Grouper les stats par statut pour les cartes détaillées
  const groupedStats = stats.reduce((acc, curr) => {
    const status = curr._id.status;
    if (!acc[status]) acc[status] = { categories: [], total: 0 };
    acc[status].categories.push({ category: curr._id.category, amount: curr.totalAmount, count: curr.count });
    acc[status].total += curr.totalAmount;
    return acc;
  }, {});

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-xl rounded-lg border border-slate-100">
          <p className="font-bold text-slate-900">{payload[0].payload.label || payload[0].name}</p>
          <p className="text-indigo-600 font-black">{payload[0].value.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex overflow-hidden pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 overflow-x-auto">
          <main className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analyse Graphique</h1>
                  <p className="text-slate-500 mt-1">Visualisation dynamique de la répartition des dépenses.</p>
                </div>
                <button 
                  onClick={fetchStats}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm font-semibold"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Rafraîchir
                </button>
              </div>

              {loading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                  <TableLoadingScreen message="Initialisation des graphiques..." />
                </div>
              ) : Object.keys(groupedStats).length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
                  <h3 className="text-xl font-bold text-slate-900">Aucune donnée disponible</h3>
                </div>
              ) : (
                <>
                  {/* Section Graphiques */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Camembert des Statuts */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <span className="w-2 h-6 bg-indigo-600 rounded-full mr-3"></span>
                        Répartition par Statut
                      </h3>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={statusData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                              nameKey="label"
                              minAngle={15} // Assure que même les petites tranches sont visibles
                            >
                              {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={36}/>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Barres des Catégories */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <span className="w-2 h-6 bg-emerald-500 rounded-full mr-3"></span>
                        Volume par Catégorie
                      </h3>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categoryData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                            <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>

                  {/* Cartes Détails */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(groupedStats).map(([status, data]) => {
                      const info = getStatusInfo(status);
                      return (
                        <div key={status} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                          <div className={`p-5 bg-gradient-to-br ${info.gradient} text-white`}>
                            <div className="flex justify-between items-center">
                              <h3 className="font-bold">{info.label}</h3>
                              <span className="text-2xl font-black">{data.total.toLocaleString('fr-FR')} €</span>
                            </div>
                          </div>
                          <div className="p-5 flex-1 space-y-4">
                            {data.categories.map((cat, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 font-medium">{cat.category || 'Autre'}</span>
                                <span className="text-sm font-bold text-slate-900">{cat.amount.toLocaleString('fr-FR')} €</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Impact Global */}
              {!loading && Object.keys(groupedStats).length > 0 && (
                <div className="bg-slate-900 rounded-3xl p-10 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] -mr-32 -mt-32"></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                      <h2 className="text-white text-4xl font-black mb-2">Total Consolidé</h2>
                      <p className="text-slate-400">Somme globale de toutes les factures traitées.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                      <span className="text-5xl font-black text-white">
                        {stats.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Stats;
