import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Medal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PerformancesDashboardProps {
  athlete?: any;
}

export const PerformancesDashboard: React.FC<PerformancesDashboardProps> = ({ athlete }) => {
  const campeonatos = athlete?.campeonatos || [];
  
  const [tooltip, setTooltip] = useState<{ top: number, left: number, prueba: string, marca: string, year: number } | null>(null);
  const [currentMedalIndex, setCurrentMedalIndex] = useState(0);

  // Extraer pruebas únicas del atleta
  const pruebas = Array.from(new Set(campeonatos.map((c: any) => c.prueba).filter(Boolean)));
  const [selectedPrueba, setSelectedPrueba] = useState<string>("all");
  
  // Medallas
  const gold = campeonatos.filter((c: any) => String(c.posicion) === "1" || String(c.posicion).toLowerCase() === "oro").length;
  const silver = campeonatos.filter((c: any) => String(c.posicion) === "2" || String(c.posicion).toLowerCase() === "plata").length;
  const bronze = campeonatos.filter((c: any) => String(c.posicion) === "3" || String(c.posicion).toLowerCase() === "bronce").length;

  // Logro destacado (Mejores medallas)
  const bestChamps = [...campeonatos].filter((c: any) => ["1","2","3","oro","plata","bronce"].includes(String(c.posicion).toLowerCase()))
    .sort((a: any, b: any) => {
      const getRank = (pos: string) => ["1","oro"].includes(pos) ? 1 : ["2","plata"].includes(pos) ? 2 : 3;
      const rankDiff = getRank(String(a.posicion).toLowerCase()) - getRank(String(b.posicion).toLowerCase());
      if (rankDiff !== 0) return rankDiff;
      if (a.fecha && b.fecha) return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      return 0;
    });
  const highlightedChamp = bestChamps.length > 0 ? bestChamps[currentMedalIndex] : null;

  const handlePrevMedal = () => {
    setCurrentMedalIndex(prev => (prev === 0 ? bestChamps.length - 1 : prev - 1));
  };
  
  const handleNextMedal = () => {
    setCurrentMedalIndex(prev => (prev === bestChamps.length - 1 ? 0 : prev + 1));
  };

  const getMedalLabel = (posicion: string) => {
    const pos = String(posicion).toLowerCase();
    if (["1","oro"].includes(pos)) return "Medalla de Oro";
    if (["2","plata"].includes(pos)) return "Medalla de Plata";
    return "Medalla de Bronce";
  };

  // Filtrar campeonatos para el gráfico según la prueba seleccionada
  const chartCampeonatos = selectedPrueba === "all" 
    ? campeonatos 
    : campeonatos.filter((c: any) => c.prueba === selectedPrueba);

  // Datos del gráfico (Personal Bests por Año)
  const pbByYear: Record<number, { pb: number, prueba: string, marca: string }> = {};
  chartCampeonatos.forEach((c: any) => {
    if (c.fecha && c.marca) {
      const year = parseInt(c.fecha.split("-")[0]);
      // Extraemos solo los números de la marca (ej. "12.5s" -> 12.5)
      const markMatch = String(c.marca).match(/[\d.]+/);
      const mark = markMatch ? parseFloat(markMatch[0]) : NaN;
      if (!isNaN(year) && !isNaN(mark)) {
        if (!pbByYear[year] || mark < pbByYear[year].pb) {
          pbByYear[year] = { pb: mark, prueba: c.prueba, marca: c.marca };
        }
      }
    }
  });

  const years = Object.keys(pbByYear).map(Number).sort((a, b) => a - b);
  let chartData = years.map(y => ({ 
    year: y, 
    pb: pbByYear[y].pb,
    prueba: pbByYear[y].prueba,
    marca: pbByYear[y].marca
  }));

  // Valores por defecto si no hay datos
  if (chartData.length === 0) {
    const currentYear = new Date().getFullYear();
    chartData = [
      { year: currentYear - 2, pb: 0, prueba: "", marca: "" },
      { year: currentYear - 1, pb: 0, prueba: "", marca: "" },
      { year: currentYear, pb: 0, prueba: "", marca: "" }
    ];
  }

  // Configuración del gráfico SVG responsivo
  const width = 700;
  const height = 320;
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Calculamos escalas para el gráfico
  let minYear = Math.min(...chartData.map(d => d.year));
  let maxYear = Math.max(...chartData.map(d => d.year));
  if (minYear === maxYear) {
    minYear -= 2;
    maxYear += 2;
  }
  if (maxYear - minYear < 5) {
     const diff = 5 - (maxYear - minYear);
     minYear -= Math.floor(diff/2);
     maxYear += Math.ceil(diff/2);
  }

  let minPb = Math.min(...chartData.map(d => d.pb));
  let maxPb = Math.max(...chartData.map(d => d.pb));
  if (minPb === maxPb) {
    minPb -= 1;
    maxPb += 1;
  }
  // Añadir un poco de holgura
  minPb = Math.max(0, Math.floor(minPb) - 0.5);
  maxPb = Math.ceil(maxPb) + 0.5;

  const getX = (year: number) => 
    padding.left + ((year - minYear) / (maxYear - minYear)) * innerWidth;
  
  // Si pb es menor (más rápido) va más arriba, por ende minPb es top.
  const getY = (pb: number) => 
    padding.top + ((pb - minPb) / (maxPb - minPb)) * innerHeight;

  // Puntos para la línea
  const points = chartData.map(d => `${getX(d.year)},${getY(d.pb)}`).join(" ");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Columna Izquierda: Logros Destacados */}
      <div className="lg:col-span-1">
        <Card className="h-full overflow-hidden border-white/60 shadow-xl rounded-3xl bg-white/60 backdrop-blur-xl flex flex-col relative">
          {/* Subtle glowing blob for premium feel */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="px-6 py-5 border-b border-white/40 flex items-center justify-between">
            <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
              <span className="material-icons-round text-yellow-500">emoji_events</span>
              Logros
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white/50 px-2 py-1 rounded-full">
              Destacados
            </span>
          </div>
          
          <CardContent className="p-6 flex-1 flex flex-col relative z-10">
            {/* Medallas */}
            <div className="flex justify-between mb-8 gap-2">
              <div className="flex flex-col items-center gap-1.5 flex-1 bg-white/50 rounded-2xl py-3 shadow-sm border border-white/40 transition-transform hover:-translate-y-1">
                <Medal className="fill-yellow-400 text-yellow-600" size={28} strokeWidth={1.5} />
                <span className="font-black text-xl text-slate-800 leading-none">{gold}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1 bg-white/50 rounded-2xl py-3 shadow-sm border border-white/40 transition-transform hover:-translate-y-1">
                <Medal className="fill-slate-300 text-slate-500" size={28} strokeWidth={1.5} />
                <span className="font-black text-xl text-slate-800 leading-none">{silver}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1 bg-white/50 rounded-2xl py-3 shadow-sm border border-white/40 transition-transform hover:-translate-y-1">
                <Medal className="fill-orange-400 text-orange-600" size={28} strokeWidth={1.5} />
                <span className="font-black text-xl text-slate-800 leading-none">{bronze}</span>
              </div>
            </div>
            
            {/* Detalles de la Medalla */}
            <div className="space-y-5 bg-white/40 p-5 rounded-2xl border border-white/60 shadow-inner flex-1">
              {highlightedChamp ? (
                <>
                  <div className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    {getMedalLabel(highlightedChamp.posicion)}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-black text-2xl text-slate-900 leading-tight">
                      {highlightedChamp.prueba}
                    </p>
                    <p className="font-black text-3xl text-red-600 leading-none tracking-tight">
                      {highlightedChamp.marca}
                    </p>
                  </div>
                  
                  <div className="w-8 h-1 bg-slate-200 rounded-full"></div>

                  <div>
                    <p className="text-sm font-semibold text-slate-600 leading-snug">
                      {highlightedChamp.campeonato}
                    </p>
                    <p className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-1">
                      <span className="material-icons-round text-[14px]">event</span>
                      {highlightedChamp.fecha}
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-500 font-black text-3xl tracking-tighter italic leading-none">
                      VALLE
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
                  <div className="w-16 h-16 bg-white/60 rounded-full flex items-center justify-center mb-3 shadow-sm">
                    <span className="material-icons-round text-3xl text-slate-300">emoji_events</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-500">Aún no hay medallas</p>
                  <p className="text-xs mt-1">Registra logros para verlos aquí</p>
                </div>
              )}
            </div>
            
            {/* Navegación lateral */}
            {bestChamps.length > 1 && (
              <div className="flex justify-between items-center mt-6 px-2">
                <button onClick={handlePrevMedal} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/60 hover:bg-white text-slate-600 shadow-sm border border-white/50 transition-all hover:scale-105 active:scale-95">
                  <span className="material-icons-round text-xl">chevron_left</span>
                </button>
                <span className="text-xs font-bold text-slate-400 tracking-widest">
                  {currentMedalIndex + 1} / {bestChamps.length}
                </span>
                <button onClick={handleNextMedal} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/60 hover:bg-white text-slate-600 shadow-sm border border-white/50 transition-all hover:scale-105 active:scale-95">
                  <span className="material-icons-round text-xl">chevron_right</span>
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Columna Derecha: Performances Dashboard */}
      <div className="lg:col-span-3">
        <Card className="h-full overflow-hidden border-white/60 shadow-xl rounded-3xl bg-white/60 backdrop-blur-xl flex flex-col relative">
          {/* Subtle glowing blob for premium feel */}
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="px-6 py-5 border-b border-white/40 flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
              <span className="material-icons-round text-red-600">trending_up</span>
              Performances
            </h3>
            
            <div className="ml-auto">
              <Select value={selectedPrueba} onValueChange={setSelectedPrueba}>
                <SelectTrigger className="bg-white/80 hover:bg-white text-slate-800 font-bold rounded-xl px-4 shadow-sm border border-white/60 h-10 w-auto min-w-[180px] focus:ring-2 focus:ring-red-500/20 transition-all">
                  <SelectValue placeholder="Seleccionar prueba" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-white/60 shadow-xl backdrop-blur-xl bg-white/90">
                  <SelectItem value="all" className="font-black text-red-600">TODAS LAS PRUEBAS</SelectItem>
                  {pruebas.map((p) => (
                    <SelectItem key={String(p)} value={String(p)} className="font-medium uppercase">
                      {String(p)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <CardContent className="p-6 flex-1 flex flex-col relative z-10">
            {/* Gráfico de Líneas */}
            <div className="w-full overflow-x-auto flex-1 flex items-center justify-center bg-white/30 rounded-2xl border border-white/40 p-4 shadow-inner">
              <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-auto min-w-[550px] select-none" 
                style={{ maxHeight: "400px" }}
              >
                <defs>
                  <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-red, #dc2626)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--primary-red, #dc2626)" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Eje Y - Etiquetas */}
                {Array.from({ length: 7 }).map((_, i) => {
                  const val = minPb + (i * (maxPb - minPb) / 6);
                  return (
                    <g key={val}>
                      <line 
                        x1={padding.left} 
                        y1={getY(val)} 
                        x2={width - padding.right} 
                        y2={getY(val)} 
                        stroke="#e2e8f0" 
                        strokeWidth="1"
                        strokeDasharray="4,4"
                      />
                      <text 
                        x={padding.left - 12} 
                        y={getY(val)} 
                        textAnchor="end" 
                        alignmentBaseline="middle" 
                        className="text-xs fill-slate-400 font-bold"
                      >
                        {val.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                {/* Eje Y - Título */}
                <text 
                  x={12} 
                  y={height / 2} 
                  transform={`rotate(-90, 12, ${height / 2})`} 
                  textAnchor="middle" 
                  className="text-xs fill-slate-400 font-bold tracking-widest uppercase"
                >
                  Marca
                </text>

                {/* Líneas de Cuadrícula Verticales y Etiquetas Eje X */}
                {Array.from({ length: maxYear - minYear + 1 }).map((_, i) => {
                  const year = minYear + i;
                  const x = getX(year);
                  return (
                    <g key={year}>
                      <text 
                        x={x} 
                        y={height - padding.bottom + 20} 
                        textAnchor="middle" 
                        className="text-xs fill-slate-500 font-black"
                      >
                        {year}
                      </text>
                    </g>
                  );
                })}

                {/* Línea Inferior (Base del gráfico) */}
                <line 
                  x1={padding.left} 
                  y1={height - padding.bottom} 
                  x2={width - padding.right + 20} 
                  y2={height - padding.bottom} 
                  stroke="#cbd5e1" 
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Fill Gradient */}
                {chartData.length > 0 && (
                  <polygon 
                    points={`${points} ${getX(chartData[chartData.length-1].year)},${height - padding.bottom} ${getX(chartData[0].year)},${height - padding.bottom}`}
                    fill="url(#chart-gradient)"
                  />
                )}

                {/* Ruta de la línea de Performance */}
                <polyline 
                  points={points} 
                  fill="none" 
                  stroke="var(--primary-red, #dc2626)" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />

                {/* Puntos de datos */}
                {chartData.map((d, i) => (
                  <g key={i}>
                    <circle 
                      cx={getX(d.year)} 
                      cy={getY(d.pb)} 
                      r="6" 
                      fill="white" 
                      stroke="var(--primary-red, #dc2626)" 
                      strokeWidth="2.5" 
                      className="cursor-pointer transition-all duration-300 hover:r-[8]"
                      onMouseEnter={(e) => {
                        if (!d.prueba) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          top: rect.top - 8,
                          left: rect.left + rect.width / 2,
                          prueba: d.prueba,
                          marca: d.marca,
                          year: d.year
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  </g>
                ))}
              </svg>
            </div>
            
            {/* Paginación Inferior (PB by Year) */}
            <div className="flex justify-center items-center gap-12 mt-6">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/60 hover:bg-white text-slate-600 shadow-sm border border-white/50 transition-all hover:scale-105 active:scale-95">
                <span className="material-icons-round text-xl">chevron_left</span>
              </button>
              <span className="text-xs font-black text-slate-500 tracking-widest uppercase bg-white/50 px-3 py-1 rounded-full shadow-sm border border-white/30">
                Personal Bests
              </span>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/60 hover:bg-white text-slate-600 shadow-sm border border-white/50 transition-all hover:scale-105 active:scale-95">
                <span className="material-icons-round text-xl">chevron_right</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Tooltip */}
      {tooltip && (
        <div 
          className="fixed z-[100] pointer-events-none -translate-x-1/2 -translate-y-full pb-2 animate-in fade-in zoom-in duration-200"
          style={{ top: tooltip.top, left: tooltip.left }}
        >
          <div className="bg-slate-900 text-white text-xs rounded-xl shadow-xl px-3 py-2.5 flex flex-col items-center min-w-[110px] border border-slate-700 relative">
            <span className="font-bold text-slate-400 mb-0.5 text-[10px] uppercase tracking-wider">{tooltip.year}</span>
            <span className="font-black truncate w-full text-center text-sm">{tooltip.prueba}</span>
            <span className="text-red-400 font-bold text-[15px]">{tooltip.marca}</span>
            {/* Triangle pointer */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-900"></div>
          </div>
        </div>
      )}
    </div>
  );
};
