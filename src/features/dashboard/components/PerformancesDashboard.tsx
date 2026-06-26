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
        <Card className="h-full overflow-hidden border-none shadow-md rounded-xl bg-white flex flex-col">
          <div className="bg-slate-900 px-5 py-4 text-white">
            <h3 className="font-bold text-lg">Logros Destacados</h3>
          </div>
          <CardContent className="p-6 flex-1 flex flex-col">
            {/* Medallas */}
            <div className="flex justify-between mb-8">
              <div className="flex flex-col items-center gap-1">
                <Medal className="fill-yellow-400 text-yellow-500" size={36} strokeWidth={1.5} />
                <span className="font-black text-xl text-slate-800">{gold}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Medal className="fill-slate-300 text-slate-400" size={36} strokeWidth={1.5} />
                <span className="font-black text-xl text-slate-800">{silver}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Medal className="fill-orange-400 text-orange-500" size={36} strokeWidth={1.5} />
                <span className="font-black text-xl text-slate-800">{bronze}</span>
              </div>
            </div>
            
            {/* Detalles de la Medalla */}
            <div className="space-y-4">
              {highlightedChamp ? (
                <>
                  <h4 className="text-yellow-600 font-medium text-lg uppercase tracking-wide">
                    {getMedalLabel(highlightedChamp.posicion)}
                  </h4>
                  
                  <div className="space-y-0.5">
                    <p className="font-black text-2xl text-slate-900 leading-none">
                      {highlightedChamp.prueba}
                    </p>
                    <p className="font-black text-2xl text-slate-900 leading-none">
                      {highlightedChamp.marca}
                    </p>
                  </div>
                  
                  <div className="text-sm font-medium text-slate-500 pt-2">
                    {highlightedChamp.campeonato}
                  </div>
                  
                  <div className="text-red-600 font-black text-4xl tracking-tighter italic">
                    VALLE
                  </div>
                  
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 text-sm">Liga Vallecaucana</p>
                    <p className="font-bold text-slate-900 text-sm">Paraatletismo</p>
                    <p className="text-sm font-medium text-slate-500 pt-1">
                      {highlightedChamp.fecha}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex h-32 flex-col items-center justify-center text-center text-slate-400">
                  <span className="material-icons-round text-3xl mb-2">emoji_events</span>
                  <p className="text-sm font-medium">Aún no hay medallas registradas</p>
                </div>
              )}
            </div>
            
            {/* Navegación lateral */}
            {bestChamps.length > 1 && (
              <div className="flex justify-between items-center mt-auto pt-8 text-slate-400">
                <button onClick={handlePrevMedal} className="hover:text-slate-600 transition-colors">
                  <span className="material-icons-round text-3xl">chevron_left</span>
                </button>
                <span className="text-xs font-bold text-slate-300">
                  {currentMedalIndex + 1} / {bestChamps.length}
                </span>
                <button onClick={handleNextMedal} className="hover:text-slate-600 transition-colors">
                  <span className="material-icons-round text-3xl">chevron_right</span>
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Columna Derecha: Performances Dashboard */}
      <div className="lg:col-span-3">
        <Card className="h-full overflow-hidden border-none shadow-md rounded-xl bg-white flex flex-col">
          <div className="bg-red-600 px-5 py-4 text-white">
            <h3 className="font-bold text-lg">Performances Dashboard</h3>
          </div>
          <CardContent className="p-6 flex-1 flex flex-col">
            {/* Cabecera de controles */}
            <div className="flex flex-wrap items-center gap-3 mb-8">

              
              <div className="ml-auto flex flex-wrap gap-3">

                <Select value={selectedPrueba} onValueChange={setSelectedPrueba}>
                  <SelectTrigger className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-md px-4 shadow-none border-none h-10 w-auto min-w-[120px] focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Seleccionar prueba" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">TODAS LAS PRUEBAS</SelectItem>
                    {pruebas.map((p) => (
                      <SelectItem key={String(p)} value={String(p)} className="font-medium uppercase">
                        {String(p)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Gráfico de Líneas */}
            <div className="w-full overflow-x-auto flex-1 flex items-center justify-center">
              <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-auto min-w-[550px] select-none" 
                style={{ maxHeight: "400px" }}
              >
                {/* Eje Y - Etiquetas */}
                {Array.from({ length: 7 }).map((_, i) => {
                  const val = minPb + (i * (maxPb - minPb) / 6);
                  return (
                    <text 
                      key={val} 
                      x={padding.left - 12} 
                      y={getY(val)} 
                      textAnchor="end" 
                      alignmentBaseline="middle" 
                      className="text-xs fill-slate-500 font-bold"
                    >
                      {val.toFixed(2)}
                    </text>
                  );
                })}

                {/* Eje Y - Título */}
                <text 
                  x={12} 
                  y={height / 2} 
                  transform={`rotate(-90, 12, ${height / 2})`} 
                  textAnchor="middle" 
                  className="text-xs fill-slate-500 font-bold tracking-wider"
                >
                  Time
                </text>

                {/* Líneas de Cuadrícula Verticales y Etiquetas Eje X */}
                {Array.from({ length: maxYear - minYear + 1 }).map((_, i) => {
                  const year = minYear + i;
                  const x = getX(year);
                  return (
                    <g key={year}>
                      {/* Línea vertical */}
                      <line 
                        x1={x} 
                        y1={padding.top} 
                        x2={x} 
                        y2={height - padding.bottom} 
                        stroke="#cbd5e1" 
                        strokeWidth="1.5"
                      />
                      {/* Etiqueta del año */}
                      <text 
                        x={x} 
                        y={height - padding.bottom + 20} 
                        textAnchor="middle" 
                        className="text-xs fill-slate-500 font-bold"
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
                  stroke="#94a3b8" 
                  strokeWidth="2"
                />

                {/* Ruta de la línea de Performance */}
                <polyline 
                  points={points} 
                  fill="none" 
                  stroke="var(--primary-red, #dc2626)" 
                  strokeWidth="2.5" 
                />

                {/* Puntos de datos */}
                {chartData.map((d, i) => (
                  <circle 
                    key={i} 
                    cx={getX(d.year)} 
                    cy={getY(d.pb)} 
                    r="4.5" 
                    fill="white" 
                    stroke="var(--primary-red, #dc2626)" 
                    strokeWidth="2.5" 
                    className="cursor-pointer transition-all duration-200 hover:r-[6]"
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
                ))}
              </svg>
            </div>
            
            {/* Paginación Inferior (PB by Year) */}
            <div className="flex justify-center items-center gap-12 mt-4 text-slate-400">
              <button className="hover:text-slate-600 transition-colors">
                <span className="material-icons-round text-2xl">arrow_back_ios_new</span>
              </button>
              <span className="text-sm font-bold text-slate-500 tracking-wide">PB by Year</span>
              <button className="hover:text-slate-600 transition-colors">
                <span className="material-icons-round text-2xl">arrow_forward_ios</span>
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
