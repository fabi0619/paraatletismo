import React, { useState, useMemo, useEffect } from "react";
import { useChampionships, useCreateChampionship } from "../hooks/useChampionships";
import { Card, CardTitle, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { QueryProvider } from "../../../components/providers/QueryProvider";
import { SearchInput } from "../../../components/search-input";
import { Trophy, MapPin, Calendar, UserRound, Plus, X } from "lucide-react";

interface Session {
  id: string;
  nombre: string;
  rol: "atleta" | "profesor" | "admin";
}

function ChampionshipsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="flex flex-col overflow-hidden pt-0 border-b-4 border-b-red-500">
          <div className="h-2 bg-red-500 w-full" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function ChampionshipsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-slate-50 p-12 text-center">
      <span className="material-icons-round mb-4 text-6xl text-slate-300">
        emoji_events
      </span>
      <h3 className="text-lg font-bold text-slate-800">
        No se encontraron campeonatos
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Intenta ajustar la búsqueda de campeonatos.
      </p>
    </div>
  );
}

const CampeonatosInner: React.FC = () => {
  const { data: championships, isLoading, isError, error } = useChampionships();
  const createChampionshipMutation = useCreateChampionship();
  
  const [search, setSearch] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [nombre, setNombre] = useState("");
  const [pais, setPais] = useState("Colombia");
  const [departamento, setDepartamento] = useState("Valle del Cauca");
  const [ciudad, setCiudad] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [fechaTexto, setFechaTexto] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sesion_usuario");
      if (raw) setSession(JSON.parse(raw));
    } catch (e) {
      console.error("Error reading session:", e);
    }
  }, []);

  const filteredChampionships = useMemo(() => {
    if (!championships) return [];
    const query = search.toLowerCase().trim();
    if (!query) return championships;
    return championships.filter(
      (c) =>
        c.nombre.toLowerCase().includes(query) ||
        c.ciudad.toLowerCase().includes(query) ||
        c.departamento.toLowerCase().includes(query) ||
        c.pais.toLowerCase().includes(query) ||
        (c.creadoPorNombre && c.creadoPorNombre.toLowerCase().includes(query))
    );
  }, [championships, search]);

  const canCreate = session?.rol === "profesor" || session?.rol === "admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!nombre.trim() || !ciudad.trim() || !fechaInicio || !fechaFin) {
      setFormError("Por favor completa los campos obligatorios (*)");
      return;
    }

    try {
      await createChampionshipMutation.mutateAsync({
        nombre,
        pais,
        departamento,
        ciudad,
        fechaInicio,
        fechaFin,
        fechaTexto: fechaTexto || `${fechaInicio} / ${fechaFin}`,
        creadoPor: session?.id || "admin",
        creadoPorNombre: session?.nombre || "Administrador"
      });

      // Reset form
      setNombre("");
      setCiudad("");
      setFechaInicio("");
      setFechaFin("");
      setFechaTexto("");
      setShowModal(false);
    } catch (err: any) {
      setFormError(err.message || "Error al crear el campeonato.");
    }
  };

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-600">
        <span className="material-icons-round mb-2 text-4xl">error_outline</span>
        <h3 className="text-lg font-bold">Error al cargar los campeonatos</h3>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar campeonato por nombre, lugar, creador..."
          resultsCount={isLoading ? undefined : filteredChampionships.length}
          className="w-full"
        />
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-red-500 text-2xl">emoji_events</span>
            <h2 className="text-xl font-black text-slate-900">
              Campeonatos y Eventos Oficiales
            </h2>
            <Badge
              variant="secondary"
              className="rounded-full text-xs font-bold tracking-widest text-muted-foreground uppercase"
            >
              {isLoading
                ? "Cargando..."
                : `${filteredChampionships.length} campeonatos`}
            </Badge>
          </div>

          {canCreate && (
            <Button
              onClick={() => setShowModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold gap-2 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={16} />
              Crear Evento
            </Button>
          )}
        </div>

        {isLoading ? (
          <ChampionshipsGridSkeleton />
        ) : filteredChampionships.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredChampionships.map((c) => (
              <Card
                key={c.id}
                className="group flex h-full flex-col overflow-hidden rounded-b-none border-b-4 border-b-red-500 pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative p-6 pb-4 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-100">
                  <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                    <Trophy size={20} />
                  </div>
                  <CardTitle className="pr-10 text-lg font-black leading-tight text-slate-800 group-hover:text-red-600 transition-colors">
                    {c.nombre}
                  </CardTitle>
                </div>

                <CardContent className="flex flex-col gap-3 p-6 pt-5">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <MapPin size={14} className="text-slate-400 shrink-0" />
                    <span>Lugar: {c.ciudad}, {c.departamento}, {c.pais}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar size={14} className="text-slate-400 shrink-0" />
                    <span>Fecha: {c.fechaTexto || `${c.fechaInicio} / ${c.fechaFin}`}</span>
                  </div>
                  <div className="mt-2 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                    <UserRound size={12} className="text-slate-400" />
                    <span>Organizado por: <strong>{c.creadoPorNombre}</strong></span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <ChampionshipsEmptyState />
        )}
      </section>

      {/* MODAL CREAR EVENTO */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-lg overflow-hidden border-0 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b p-5 bg-gradient-to-r from-red-600 to-red-700 text-white">
              <div className="flex items-center gap-2">
                <Trophy size={20} />
                <h3 className="font-black text-lg">Registrar Campeonato</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {formError && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-600">
                  {formError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Nombre del Evento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej. Juegos Deportivos Nacionales"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    País
                  </label>
                  <input
                    type="text"
                    value={pais}
                    onChange={(e) => setPais(e.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Departamento
                  </label>
                  <input
                    type="text"
                    value={departamento}
                    onChange={(e) => setDepartamento(e.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Ciudad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej. Cali"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Fecha Inicio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Fecha Fin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Texto de Rango de Fechas (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. 10 al 15 de Octubre 2026"
                  value={fechaTexto}
                  onChange={(e) => setFechaTexto(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div className="mt-4 flex justify-end gap-3 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createChampionshipMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
                >
                  {createChampionshipMutation.isPending ? "Guardando..." : "Guardar Evento"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export const CampeonatosView: React.FC = () => {
  return (
    <QueryProvider>
      <CampeonatosInner />
    </QueryProvider>
  );
};
