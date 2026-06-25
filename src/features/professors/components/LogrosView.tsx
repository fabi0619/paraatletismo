import React, { useState, useMemo, useEffect } from "react";
import { useLogros, useCreateLogro } from "../hooks/useLogros";
import { useAthletes } from "../../athletes/hooks/useAthletes";
import { useChampionships } from "../../championships/hooks/useChampionships";
import { Card, CardTitle, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { QueryProvider } from "../../../components/providers/QueryProvider";
import { SearchInput } from "../../../components/search-input";
import { Trophy, Calendar, UserRound, Plus, X, Award, Medal } from "lucide-react";

interface Session {
  id: string;
  nombre: string;
  rol: "atleta" | "profesor" | "admin";
}

function LogrosGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

function LogrosEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-slate-50 p-12 text-center">
      <span className="material-icons-round mb-4 text-6xl text-slate-300">
        workspace_premium
      </span>
      <h3 className="text-lg font-bold text-slate-800">
        No se encontraron logros registrados
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Los entrenadores aún no han registrado logros deportivos.
      </p>
    </div>
  );
}

function getMedalBadgeColor(logroText: string) {
  const text = logroText.toLowerCase();
  if (text.includes("oro")) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (text.includes("plata")) return "bg-slate-100 text-slate-800 border-slate-200";
  if (text.includes("bronce")) return "bg-orange-100 text-orange-800 border-orange-200";
  return "bg-red-50 text-red-700 border-red-100";
}

const LogrosInner: React.FC = () => {
  const { data: logros, isLoading, isError, error } = useLogros();
  const { data: athletes } = useAthletes();
  const { data: championships } = useChampionships();
  const createLogroMutation = useCreateLogro();

  const [search, setSearch] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [atletaId, setAtletaId] = useState("");
  const [selectedChampionshipId, setSelectedChampionshipId] = useState("");
  const [prueba, setPrueba] = useState("");
  const [medalla, setMedalla] = useState("Oro");
  const [detalles, setDetalles] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sesion_usuario");
      if (raw) setSession(JSON.parse(raw));
    } catch (e) {
      console.error("Error reading session:", e);
    }
  }, []);

  const filteredLogros = useMemo(() => {
    if (!logros) return [];
    const query = search.toLowerCase().trim();
    if (!query) return logros;
    return logros.filter(
      (l) =>
        l.campeonato.toLowerCase().includes(query) ||
        l.atletaNombre.toLowerCase().includes(query) ||
        l.logro.toLowerCase().includes(query) ||
        l.ano.includes(query) ||
        (l.profesorNombre && l.profesorNombre.toLowerCase().includes(query))
    );
  }, [logros, search]);

  const canCreate = session?.rol === "profesor" || session?.rol === "admin";

  // Dynamic test events (pruebas) based on selected athlete
  const availablePruebas = useMemo(() => {
    if (!atletaId || !athletes) return [];
    const athlete = athletes.find((a) => a.id === atletaId);
    if (!athlete) return [];
    const cl = (athlete.claseDeportiva || "").trim().toUpperCase();

    if (!cl || cl === "GUIA" || cl === "AUXILIAR") {
      // General fallbacks if guiding or no class
      return ["100m", "200m", "400m", "Salto Largo", "Lanzamiento de Bala"];
    }

    if (cl.startsWith("T")) {
      // Track (Pista) athlete
      return [
        `100m ${cl}`,
        `200m ${cl}`,
        `400m ${cl}`,
        `800m ${cl}`,
        `1500m ${cl}`,
        `5000m ${cl}`,
        `10000m ${cl}`,
        `Relevos ${cl}`
      ];
    } else if (cl.startsWith("F")) {
      // Field (Campo) athlete
      return [
        `Lanzamiento de Bala ${cl}`,
        `Lanzamiento de Disco ${cl}`,
        `Lanzamiento de Jabalina ${cl}`,
        `Lanzamiento de Maza ${cl}`,
        `Salto Largo ${cl}`,
        `Salto Alto ${cl}`
      ];
    }

    return [`100m ${cl}`, `Salto Largo ${cl}`, `Lanzamiento de Bala ${cl}`];
  }, [atletaId, athletes]);

  // Reset selected event test if it's not in the new available list
  useEffect(() => {
    if (availablePruebas.length > 0) {
      setPrueba(availablePruebas[0]);
    } else {
      setPrueba("");
    }
  }, [availablePruebas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!atletaId || !selectedChampionshipId || !prueba || !medalla) {
      setFormError("Por favor completa los campos requeridos.");
      return;
    }

    const event = championships?.find((c) => String(c.id) === String(selectedChampionshipId));
    if (!event) {
      setFormError("El campeonato seleccionado no es válido.");
      return;
    }

    // Extract year from event date
    const ano = event.fechaInicio ? event.fechaInicio.split("-")[0] : new Date().getFullYear().toString();

    // Auto-generate the logro description based on inputs
    const logroText = `Obtuvo Medalla de ${medalla} en la prueba de ${prueba}.${detalles.trim() ? ` Detalle: ${detalles.trim()}` : ""}`;

    try {
      await createLogroMutation.mutateAsync({
        profesorId: session?.id || "admin",
        atletaId,
        campeonato: event.nombre,
        logro: logroText,
        ano
      });

      // Reset form
      setAtletaId("");
      setSelectedChampionshipId("");
      setDetalles("");
      setShowModal(false);
    } catch (err: any) {
      setFormError(err.message || "Error al registrar el logro deportivo.");
    }
  };

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-600">
        <span className="material-icons-round mb-2 text-4xl">error_outline</span>
        <h3 className="text-lg font-bold">Error al cargar los logros</h3>
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
          placeholder="Buscar logros por campeonato, atleta, entrenador, medalla..."
          resultsCount={isLoading ? undefined : filteredLogros.length}
          className="w-full"
        />
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-red-500 text-2xl">workspace_premium</span>
            <h2 className="text-xl font-black text-slate-900">
              Palmarés e Historial de Logros
            </h2>
            <Badge
              variant="secondary"
              className="rounded-full text-xs font-bold tracking-widest text-muted-foreground uppercase"
            >
              {isLoading
                ? "Cargando..."
                : `${filteredLogros.length} logros`}
            </Badge>
          </div>

          {canCreate && (
            <Button
              onClick={() => setShowModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold gap-2 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={16} />
              Registrar Logro
            </Button>
          )}
        </div>

        {isLoading ? (
          <LogrosGridSkeleton />
        ) : filteredLogros.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLogros.map((l) => (
              <Card
                key={l.id}
                className="group flex h-full flex-col overflow-hidden rounded-b-none border-b-4 border-b-red-500 pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative p-6 pb-4 bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-100">
                  <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                    <Award size={20} />
                  </div>
                  <span className="inline-block rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] font-black tracking-widest uppercase px-2 py-0.5 mb-2">
                    Año {l.ano}
                  </span>
                  <CardTitle className="pr-10 text-lg font-black leading-tight text-slate-800 group-hover:text-red-600 transition-colors">
                    {l.campeonato}
                  </CardTitle>
                </div>

                <CardContent className="flex flex-col gap-4 p-6 pt-5 flex-1 justify-between">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 border rounded-xl p-3">
                      <UserRound size={16} className="text-red-500 shrink-0" />
                      <div className="flex flex-col leading-none">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Atleta</span>
                        <span className="font-extrabold text-slate-800">{l.atletaNombre}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-slate-600 leading-relaxed font-medium mt-1 flex flex-col gap-2">
                      <span className={`inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-0.5 text-xs font-black border ${getMedalBadgeColor(l.logro)}`}>
                        <Medal size={12} />
                        {l.logro.toLowerCase().includes("oro") ? "Medalla de Oro" : l.logro.toLowerCase().includes("plata") ? "Medalla de Plata" : l.logro.toLowerCase().includes("bronce") ? "Medalla de Bronce" : "Resultado"}
                      </span>
                      <p className="text-slate-700 font-semibold">{l.logro}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold">Entrenador: <strong className="text-slate-700">{l.profesorNombre}</strong></span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <LogrosEmptyState />
        )}
      </section>

      {/* MODAL REGISTRAR LOGRO */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-lg overflow-hidden border-0 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b p-5 bg-gradient-to-r from-red-600 to-red-700 text-white">
              <div className="flex items-center gap-2">
                <Award size={20} />
                <h3 className="font-black text-lg">Registrar Logro Deportivo</h3>
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

              {/* 1. Atleta */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Deportista Asociado <span className="text-red-500">*</span>
                </label>
                <select
                  value={atletaId}
                  onChange={(e) => setAtletaId(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden bg-white"
                  required
                >
                  <option value="">Selecciona el atleta...</option>
                  {athletes?.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre} ({a.claseDeportiva ? `Clase ${a.claseDeportiva}` : 'Sin clasificación'})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Campeonato / Evento */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Campeonato / Evento Oficial <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedChampionshipId}
                  onChange={(e) => setSelectedChampionshipId(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden bg-white"
                  required
                >
                  <option value="">Selecciona el campeonato...</option>
                  {championships?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} ({c.ciudad}, {c.fechaInicio.split("-")[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 3. Medalla */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Medalla lograda <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={medalla}
                    onChange={(e) => setMedalla(e.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden bg-white"
                    required
                  >
                    <option value="Oro">Oro</option>
                    <option value="Plata">Plata</option>
                    <option value="Bronce">Bronce</option>
                  </select>
                </div>

                {/* 4. Prueba */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Prueba en la que compitió <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={prueba}
                    onChange={(e) => setPrueba(e.target.value)}
                    disabled={!atletaId}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden bg-white disabled:bg-slate-50 disabled:text-slate-400"
                    required
                  >
                    {!atletaId ? (
                      <option value="">Selecciona primero un atleta...</option>
                    ) : (
                      availablePruebas.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* 5. Detalles adicionales */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Detalles Adicionales (Opcional)
                </label>
                <textarea
                  placeholder="Ej. Logró una marca de 11.45s superando su récord personal."
                  value={detalles}
                  onChange={(e) => setDetalles(e.target.value)}
                  rows={3}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden resize-none"
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
                  disabled={createLogroMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
                >
                  {createLogroMutation.isPending ? "Guardando..." : "Guardar Logro"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export const LogrosView: React.FC = () => {
  return (
    <QueryProvider>
      <LogrosInner />
    </QueryProvider>
  );
};
