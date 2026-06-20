import React from 'react';
import type { Athlete } from '../api/athletesService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';

interface AthleteCardProps {
  athlete: Athlete;
  onClick: () => void;
}

export const AthleteCard: React.FC<AthleteCardProps> = ({ athlete, onClick }) => {
  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-slate-100 overflow-hidden flex flex-col"
    >
      <div className="relative h-32 bg-slate-900 overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600 via-transparent to-transparent blur-xl"></div>
        {athlete.foto ? (
          <img src={athlete.foto} alt={athlete.nombre} className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800">
            <span className="material-icons-round text-5xl text-slate-600">person</span>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-black text-slate-900 truncate">
          {athlete.nombre}
        </CardTitle>
        <CardDescription className="text-xs font-bold text-slate-500 uppercase tracking-widest truncate">
          {athlete.club || 'Atleta Valle'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col justify-between">
        <div className="flex flex-wrap gap-2 mb-4">
          {athlete.discapacidad && (
            <span className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded-md border border-red-100 capitalize">
              {athlete.discapacidad.replace('Discapacidad ', '')}
            </span>
          )}
          {athlete.claseDeportiva && (
            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md border border-slate-200">
              Clase {athlete.claseDeportiva}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="material-icons-round text-[14px]">emoji_events</span>
          <span>{athlete.campeonatos?.length || 0} medallas</span>
        </div>
      </CardContent>
    </Card>
  );
};
