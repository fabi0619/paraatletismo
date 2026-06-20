import React from 'react';
import { useAthlete } from '../hooks/useAthletes';
import { QueryProvider } from '../../../components/providers/QueryProvider';

const AthleteProfileInner: React.FC<{ id: string }> = ({ id }) => {
  const { data: athlete, isLoading, isError, error } = useAthlete(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (isError || !athlete) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 p-8 text-center text-red-600">
        <span className="material-icons-round text-6xl mb-4">error_outline</span>
        <h2 className="text-2xl font-black">Atleta no encontrado</h2>
        <p className="mt-2 text-slate-500">{error?.message || "No se pudo cargar la información del atleta."}</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg font-bold"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  // Calculate age
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '-';
    const ageDifMs = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) + ' años';
  };

  const getGoldMedals = () => athlete.campeonatos?.filter(c => c.posicion === '1').length || 0;
  const getSilverMedals = () => athlete.campeonatos?.filter(c => c.posicion === '2').length || 0;
  const getBronzeMedals = () => athlete.campeonatos?.filter(c => c.posicion === '3').length || 0;

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600 via-transparent to-transparent blur-2xl"></div>
          <div className="flex items-center gap-4 relative z-10">
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors font-bold text-sm"
            >
              <span className="material-icons-round text-sm">arrow_back</span>
              Regresar
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row min-h-[600px]">
          {/* Left Panel */}
          <div className="w-full md:w-1/3 p-8 border-r border-slate-100 bg-slate-50 flex flex-col gap-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">
                {athlete.nombre.split(' ')[0]} <br/>
                <span className="text-red-600">{athlete.nombre.split(' ').slice(1).join(' ')}</span>
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Clasificación</span>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-black">
                  {athlete.claseDeportiva || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Edad</span>
                <span className="font-bold text-slate-700">{calculateAge(athlete.fechaNacimiento)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Club</span>
                <span className="font-bold text-slate-700 text-right">{athlete.club || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Center Panel */}
          <div className="w-full md:w-1/3 p-8 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl relative mb-8">
               {athlete.foto ? (
                 <img src={athlete.foto} alt={athlete.nombre} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                   <span className="material-icons-round text-7xl text-slate-600">person</span>
                 </div>
               )}
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-4 w-full text-left">Medallas Obtenidas</h3>
            <div className="flex gap-4 w-full justify-between bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/40 mb-2"></div>
                <span className="font-black text-xl text-slate-800">{getGoldMedals()}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-300 shadow-lg shadow-slate-300/40 mb-2"></div>
                <span className="font-black text-xl text-slate-800">{getSilverMedals()}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-orange-400 shadow-lg shadow-orange-400/40 mb-2"></div>
                <span className="font-black text-xl text-slate-800">{getBronzeMedals()}</span>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/3 p-8 border-l border-slate-100 flex flex-col">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-icons-round text-red-600">emoji_events</span>
              Historial Deportivo
            </h3>

            {athlete.campeonatos && athlete.campeonatos.length > 0 ? (
              <div className="flex flex-col gap-4 overflow-y-auto pr-2">
                {athlete.campeonatos.map((camp) => (
                  <div key={camp.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-sm text-slate-500">{camp.fecha?.split('-')[0]}</span>
                      {camp.posicion && (
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                          camp.posicion === '1' ? 'bg-yellow-100 text-yellow-800' :
                          camp.posicion === '2' ? 'bg-slate-200 text-slate-800' :
                          camp.posicion === '3' ? 'bg-orange-100 text-orange-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          Pos {camp.posicion}
                        </span>
                      )}
                    </div>
                    <h4 className="font-black text-slate-800 text-sm mb-1">{camp.campeonato}</h4>
                    <p className="text-xs text-slate-500 font-medium">Prueba: <span className="text-slate-700">{camp.prueba}</span> | Marca: <span className="text-red-600 font-bold">{camp.marca}</span></p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 h-full">
                <span className="material-icons-round text-4xl text-slate-300 mb-2">history</span>
                <p className="text-sm font-bold text-slate-500">Sin historial registrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AthleteProfile: React.FC<{ id: string }> = ({ id }) => {
  return (
    <QueryProvider>
      <AthleteProfileInner id={id} />
    </QueryProvider>
  );
};
