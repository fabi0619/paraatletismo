import React, { useState, useMemo } from 'react';
import { useAthletes } from '../hooks/useAthletes';
import { AthleteCard } from './AthleteCard';
import { Input } from '../../../components/ui/input';
import { QueryProvider } from '../../../components/providers/QueryProvider';

const AthletesGridInner: React.FC = () => {
  const { data: athletes, isLoading, isError, error } = useAthletes();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDiscapacidad, setFilterDiscapacidad] = useState('all');
  const [filterTipoClase, setFilterTipoClase] = useState('all');

  const filteredAthletes = useMemo(() => {
    if (!athletes) return [];
    
    return athletes.filter(athlete => {
      // 1. Busqueda por nombre o cedula
      const term = searchTerm.toLowerCase();
      const matchesSearch = !term || 
        (athlete.nombre || '').toLowerCase().includes(term) || 
        (athlete.cedula || '').toLowerCase().includes(term);

      // 2. Filtro discapacidad
      const matchesDiscapacidad = filterDiscapacidad === 'all' || 
        (athlete.discapacidad && athlete.discapacidad.toLowerCase().includes(filterDiscapacidad.toLowerCase()));

      // 3. Filtro modalidad (tipo clase)
      const matchesTipoClase = filterTipoClase === 'all' || 
        (athlete.tipoClase && athlete.tipoClase.toLowerCase() === filterTipoClase.toLowerCase());

      return matchesSearch && matchesDiscapacidad && matchesTipoClase;
    });
  }, [athletes, searchTerm, filterDiscapacidad, filterTipoClase]);

  if (isError) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100">
        <span className="material-icons-round text-4xl mb-2">error_outline</span>
        <h3 className="font-bold text-lg">Error al cargar los atletas</h3>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <span className="material-icons-round absolute left-3 top-2.5 text-slate-400">search</span>
          <Input 
            type="text" 
            placeholder="Buscar atleta por nombre o cédula..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-red-500 transition-colors"
            >
              <span className="material-icons-round text-sm">close</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-red-500"
            value={filterDiscapacidad}
            onChange={(e) => setFilterDiscapacidad(e.target.value)}
          >
            <option value="all">Todas las discapacidades</option>
            <option value="fisica">Física</option>
            <option value="visual">Visual</option>
            <option value="intelectual">Intelectual</option>
            <option value="auditiva">Auditiva</option>
          </select>

          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-red-500"
            value={filterTipoClase}
            onChange={(e) => setFilterTipoClase(e.target.value)}
          >
            <option value="all">Todas (T / F)</option>
            <option value="pista">Pista (T)</option>
            <option value="campo">Campo (F)</option>
          </select>

          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterDiscapacidad('all');
              setFilterTipoClase('all');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors flex items-center gap-1"
          >
            <span className="material-icons-round text-[16px]">restart_alt</span>
            Restablecer
          </button>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-2">
          <h2 className="text-xl font-black text-slate-900">Nuestros Atletas</h2>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
            {isLoading ? 'Cargando...' : `Mostrando ${filteredAthletes.length} atletas`}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : filteredAthletes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAthletes.map(athlete => (
              <AthleteCard 
                key={athlete.id} 
                athlete={athlete} 
                onClick={() => window.location.href = `/atleta/${athlete.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-3xl border border-slate-100 text-center">
            <span className="material-icons-round text-6xl text-slate-300 mb-4">sentiment_dissatisfied</span>
            <h3 className="text-lg font-bold text-slate-800">No se encontraron atletas</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              Intenta ajustar los criterios de búsqueda o cambiar los filtros seleccionados.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export const AthletesView: React.FC = () => {
  return (
    <QueryProvider>
      <AthletesGridInner />
    </QueryProvider>
  );
};
