import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { championshipsService } from "../../championships/api/championshipsService";
import { useAthlete } from "../hooks/useAthletes";
import { QueryProvider } from "../../../components/providers/QueryProvider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Medal } from "lucide-react";
import { PerformancesDashboard } from "../../dashboard/components/PerformancesDashboard";

const BASE_PRUEBAS = [
  "100m", "200m", "400m", "800m", "1500m", "5000m", "10000m", "Maratón", "Marcha 20km",
  "Salto Largo", "Salto Alto", "Salto Triple",
  "Lanzamiento Bala", "Lanzamiento Disco", "Lanzamiento Jabalina", "Lanzamiento Club", "Lanzamiento Martillo",
  "Pentatlón", "Heptatlón"
];

const ProfileSkeleton: React.FC = () => (
  <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
    <div className="mx-auto max-w-6xl space-y-6">
      <Skeleton className="h-14 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <Skeleton className="h-40 w-40 rounded-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-6 w-1/3" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-6 w-1/4" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

const AthleteProfileInner: React.FC<{ id: string }> = ({ id }) => {
  const { data: athlete, isLoading, isError, error } = useAthlete(id);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [marcaForm, setMarcaForm] = useState({
    eventoId: "",
    prueba: "",
    marca: "",
    posicion: "",
  });

  // Calculate permissions based on current session
  const sesionStr = typeof window !== 'undefined' ? localStorage.getItem('sesion_usuario') : null;
  const sesion = sesionStr ? JSON.parse(sesionStr) : null;
  const canEdit = sesion && (
    sesion.rol === 'admin' || 
    sesion.rol === 'profesor' || 
    (sesion.rol === 'atleta' && sesion.id === id)
  );

  const { data: eventos, isLoading: isLoadingEventos } = useQuery({
    queryKey: ["eventos"],
    queryFn: championshipsService.getChampionships,
  });

  const handleSaveMarca = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Buscar el evento seleccionado (comparando como string por si acaso el ID es numérico)
      const evt = eventos?.find((ev: any) => String(ev.id) === String(marcaForm.eventoId));
      
      // Crear el nuevo registro de campeonato
      const newChamp = {
        atleta_id: id,
        campeonato: evt?.nombre || "Campeonato Registrado",
        lugar: evt?.ciudad ? `${evt.ciudad}, ${evt.pais}` : "Local",
        prueba: marcaForm.prueba,
        marca: marcaForm.marca,
        fecha: evt?.fechaInicio || new Date().toISOString().split("T")[0],
        posicion: marcaForm.posicion,
      };

      // Guardar en la base de datos (se usa el ID del admin o profesor actual)
      const sesionStr = typeof window !== 'undefined' ? localStorage.getItem('sesion_usuario') : null;
      const sesion = sesionStr ? JSON.parse(sesionStr) : null;
      const profesorId = sesion?.id || "admin";
      
      // Import the service dynamically or use it if imported
      const { athletesService } = await import('../../athletes/api/athletesService');
      await athletesService.saveChampionship(newChamp, profesorId);

      // Invalidate cache to force a refetch from backend
      queryClient.invalidateQueries({ queryKey: ['athletes'] });

      setIsModalOpen(false);
      setMarcaForm({ eventoId: "", prueba: "", marca: "", posicion: "" });
    } catch (err) {
      console.error("Error guardando marca:", err);
      alert("Hubo un error al guardar la marca. Por favor intenta de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !athlete) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-8 text-center text-red-600">
        <span className="material-icons-round mb-4 text-6xl">
          error_outline
        </span>
        <h2 className="text-2xl font-black">Atleta no encontrado</h2>
        <p className="mt-2 text-muted-foreground">
          {error?.message || "No se pudo cargar la información del atleta."}
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 rounded-lg bg-red-600 px-6 py-2 font-bold text-white"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "-";
    const ageDifMs = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) + " años";
  };

  const gold =
    athlete.campeonatos?.filter((c) => c.posicion === "1").length || 0;
  const silver =
    athlete.campeonatos?.filter((c) => c.posicion === "2").length || 0;
  const bronze =
    athlete.campeonatos?.filter((c) => c.posicion === "3").length || 0;

  const infoItems = [
    { label: "Clasificación", value: athlete.claseDeportiva, badge: true },
    { label: "Edad", value: calculateAge(athlete.fechaNacimiento) },
    { label: "Club", value: athlete.club },
    { label: "Discapacidad", value: athlete.discapacidad },
    { label: "Género", value: athlete.genero },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <Card className="border-none bg-slate-900">
          <CardContent className="flex items-center p-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20"
            >
              <span className="material-icons-round text-sm">arrow_back</span>
              Regresar
            </button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left — Photo & Identity */}
          <Card className="md:col-span-1">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-xl">
                {athlete.foto ? (
                  <img
                    src={athlete.foto}
                    alt={athlete.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-800">
                    <span className="material-icons-round text-6xl text-slate-600">
                      person
                    </span>
                  </div>
                )}
              </div>
              <h2 className="text-2xl leading-tight font-black text-black">
                {athlete.nombre.split(" ")[0]}
              </h2>
              <p className="text-lg font-bold text-red-600">
                {athlete.nombre.split(" ").slice(1).join(" ")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {athlete.club || "Sin club"}
              </p>
            </CardContent>
          </Card>

          {/* Right — Info & Medals */}
          <div className="space-y-6 md:col-span-2">
            {/* Medals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="material-icons-round text-red-600">
                    emoji_events
                  </span>
                  Medallas Obtenidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                    <Medal className="fill-yellow-400" size={50} />
                    <span className="text-2xl font-black text-slate-800">
                      {gold}
                    </span>
                    <span className="text-xs font-bold tracking-wider text-yellow-700 uppercase">
                      Oro
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <Medal className="fill-slate-400" size={50} />
                    <span className="text-2xl font-black text-slate-800">
                      {silver}
                    </span>
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                      Plata
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 p-4">
                    <Medal className="fill-orange-400" size={50} />
                    <span className="text-2xl font-black text-slate-800">
                      {bronze}
                    </span>
                    <span className="text-xs font-bold tracking-wider text-orange-700 uppercase">
                      Bronce
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Atleta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {infoItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-slate-100 pb-3"
                    >
                      <span className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                        {item.label}
                      </span>
                      {item.badge ? (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                          {item.value || "N/A"}
                        </span>
                      ) : (
                        <span className="text-right font-bold text-slate-700">
                          {item.value || "N/A"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
                  
        {/* Performances Dashboard Section */}
        <PerformancesDashboard athlete={athlete} />

        {/* Championship History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <span className="material-icons-round text-red-600">history</span>
              Historial Deportivo
            </CardTitle>
            {canEdit && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-red-700 shadow-sm"
              >
                <span className="material-icons-round text-sm">add</span>
                Registrar Marca
              </button>
            )}
          </CardHeader>
          <CardContent>
            {athlete.campeonatos && athlete.campeonatos.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {athlete.campeonatos.map((camp: any) => (
                  <div
                    key={camp.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h4 className="text-sm font-black text-slate-800 leading-tight">
                        {camp.campeonato}
                      </h4>
                      {camp.posicion && (
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-black ${
                            camp.posicion === "1" || String(camp.posicion).toLowerCase() === "oro"
                              ? "bg-yellow-100 text-yellow-800"
                              : camp.posicion === "2" || String(camp.posicion).toLowerCase() === "plata"
                                ? "bg-slate-200 text-slate-800"
                                : camp.posicion === "3" || String(camp.posicion).toLowerCase() === "bronce"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          Pos {camp.posicion}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 mt-3">
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="material-icons-round text-[14px]">event</span>
                        <span className="font-medium text-slate-700">
                          {camp.fecha}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="material-icons-round text-[14px]">directions_run</span>
                        <span className="font-medium text-slate-700">
                          {camp.prueba}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="material-icons-round text-[14px]">timer</span>
                        <span className="font-bold text-red-600">
                          {camp.marca}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center">
                <span className="material-icons-round mb-2 text-4xl text-slate-300">
                  history
                </span>
                <p className="text-sm font-bold text-muted-foreground">
                  Sin historial registrado
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Floating Modal for Registering Marca */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600"></div>
            
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span className="material-icons-round text-red-600">emoji_events</span>
                Registrar Marca
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
              >
                <span className="material-icons-round text-sm">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSaveMarca} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Campeonato / Evento</label>
                <select
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  value={marcaForm.eventoId}
                  onChange={(e) => setMarcaForm({ ...marcaForm, eventoId: e.target.value })}
                >
                  <option value="">Seleccione un evento...</option>
                  {!isLoadingEventos && eventos?.map((evt: any) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.nombre} ({evt.fechaTexto || evt.fechaInicio})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Prueba</label>
                <select
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  value={marcaForm.prueba}
                  onChange={(e) => setMarcaForm({ ...marcaForm, prueba: e.target.value })}
                >
                  <option value="">Seleccione una prueba...</option>
                  {BASE_PRUEBAS.map((prueba) => {
                    const label = athlete.claseDeportiva ? `${prueba} ${athlete.claseDeportiva}` : prueba;
                    return (
                      <option key={prueba} value={label}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Marca / Resultado</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 11.45"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    value={marcaForm.marca}
                    onChange={(e) => {
                      // Permitir solo números y punto decimal
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      setMarcaForm({ ...marcaForm, marca: val });
                    }}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Posición</label>
                  <select
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    value={marcaForm.posicion}
                    onChange={(e) => setMarcaForm({ ...marcaForm, posicion: e.target.value })}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="1">1° (Oro)</option>
                    <option value="2">2° (Plata)</option>
                    <option value="3">3° (Bronce)</option>
                    <option value="4">4° Lugar</option>
                    <option value="5">5° Lugar</option>
                    <option value="6">6° Lugar</option>
                    <option value="7">7° Lugar</option>
                    <option value="8">8° Lugar</option>
                    <option value="Participación">Participación</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`flex items-center gap-1.5 rounded-lg px-6 py-2 text-sm font-bold text-white transition-colors shadow-md ${isSaving ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  <span className="material-icons-round text-[16px]">
                    {isSaving ? 'hourglass_empty' : 'save'}
                  </span>
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
