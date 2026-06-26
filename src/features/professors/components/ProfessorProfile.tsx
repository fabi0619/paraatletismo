import React, { useState, useEffect } from "react";
import { useProfessor, useProfessorAchievements } from "../hooks/useProfessors";
import { useChampionships } from "../../championships/hooks/useChampionships";
import { useAthletes } from "../../athletes/hooks/useAthletes";
import { QueryProvider } from "../../../components/providers/QueryProvider";
import { useQueryClient } from "@tanstack/react-query";
import { professorsService } from "../api/professorsService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Award, Mail, IdCard, Phone, Calendar, Shield } from "lucide-react";
import { useMemo } from "react";

interface Session {
  id: string;
  nombre: string;
  rol: "atleta" | "profesor" | "admin";
}

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
    </div>
  </div>
);

const ProfessorProfileInner: React.FC<{ id: string }> = ({ id }) => {
  const { data: professor, isLoading, isError, error } = useProfessor(id);
  const { data: achievements, isLoading: achievementsLoading } = useProfessorAchievements(id);
  const { data: championships } = useChampionships();
  const { data: athletes } = useAthletes();
  const [session, setSession] = useState<Session | null>(null);
  const queryClient = useQueryClient();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState<any>({});

  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [achievementForm, setAchievementForm] = useState<any>(null);

  const availablePruebas = useMemo(() => {
    if (!achievementForm?.atletaId || !athletes) return [];
    const athlete = athletes.find((a) => a.id === achievementForm.atletaId);
    if (!athlete) return [];
    const cl = (athlete.claseDeportiva || "").trim().toUpperCase();

    if (!cl || cl === "GUIA" || cl === "AUXILIAR") {
      return ["100m", "200m", "400m", "Salto Largo", "Lanzamiento de Bala"];
    }

    if (cl.startsWith("T")) {
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
  }, [achievementForm?.atletaId, athletes]);

  useEffect(() => {
    if (professor) {
      setProfileForm({
        nombre: professor.nombre || "",
        especialidad: professor.especialidad || "",
        cedula: professor.cedula || "",
        fechaNacimiento: professor.fechaNacimiento || "",
        correo: professor.correo || "",
        telefono: professor.telefono || ""
      });
    }
  }, [professor]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sesion_usuario");
      if (raw) setSession(JSON.parse(raw));
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !professor) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-8 text-center text-red-600">
        <span className="material-icons-round mb-4 text-6xl">error_outline</span>
        <h2 className="text-2xl font-black">Entrenador no encontrado</h2>
        <p className="mt-2 text-muted-foreground">
          {error?.message || "No se pudo cargar la información del entrenador."}
        </p>
        <button
          onClick={() => (window.location.href = "/profesores")}
          className="mt-6 rounded-lg bg-red-600 px-6 py-2 font-bold text-white"
        >
          Volver a Entrenadores
        </button>
      </div>
    );
  }

  const isSelf = session?.id === professor.id || session?.rol === "admin";

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "-";
    const ageDifMs = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) + " años";
  };

  const infoItems = [
    { label: "Especialidad", value: professor.especialidad, icon: <Shield size={16} className="text-red-500" /> },
    { label: "Cédula", value: professor.cedula, icon: <IdCard size={16} className="text-slate-500" /> },
    { label: "Edad", value: professor.fechaNacimiento ? `${calculateAge(professor.fechaNacimiento)} (${professor.fechaNacimiento})` : "N/A", icon: <Calendar size={16} className="text-green-500" /> },
    { label: "Correo", value: professor.correo, icon: <Mail size={16} className="text-orange-500" /> },
    { label: "Teléfono", value: professor.telefono || "N/A", icon: <Phone size={16} className="text-teal-500" /> },
    { label: "Género", value: professor.genero || "N/A", icon: <span className="material-icons-round text-sm text-purple-500">transgender</span> },
  ];

  const handleEditClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professor) return;
    try {
      const updated = { ...professor, ...profileForm };
      await professorsService.saveProfessor(updated);
      queryClient.setQueryData(["professor", id], updated);
      queryClient.invalidateQueries({ queryKey: ["professors"] });
      setIsProfileModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error al guardar perfil.");
    }
  };

  const handleEditAchievement = (ach: any) => {
    let medalla = "Oro";
    let prueba = "";
    let detalles = "";

    const match = ach.logro.match(/Obtuvo Medalla de (.*?) en la prueba de (.*?)\.(?: Detalle: (.*))?/);
    if (match) {
      medalla = match[1];
      prueba = match[2];
      detalles = match[3] || "";
    } else {
      detalles = ach.logro;
    }

    setAchievementForm({ 
      ...ach, 
      medalla, 
      prueba, 
      detalles 
    });
    setIsAchievementModalOpen(true);
  };

  const handleSaveAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achievementForm) return;
    
    // Auto-generate the logro description based on inputs
    const logroText = `Obtuvo Medalla de ${achievementForm.medalla} en la prueba de ${achievementForm.prueba}.${achievementForm.detalles.trim() ? ` Detalle: ${achievementForm.detalles.trim()}` : ""}`;
    const payloadToSave = { ...achievementForm, logro: logroText };

    try {
      await professorsService.updateAchievement(achievementForm.id, payloadToSave);
      queryClient.setQueryData(["professorAchievements", id], (old: any) => 
        (old || []).map((a: any) => a.id === achievementForm.id ? { ...a, ...payloadToSave } : a)
      );
      setIsAchievementModalOpen(false);
      setAchievementForm(null);
    } catch (error) {
      console.error(error);
      alert("Error al guardar logro.");
    }
  };

  const handleDeleteAchievement = async (logroId: string) => {
    if (!confirm("¿Seguro que deseas eliminar este logro?")) return;
    try {
      await professorsService.deleteAchievement(logroId);
      queryClient.setQueryData(["professorAchievements", id], (old: any) => 
        (old || []).filter((a: any) => a.id !== logroId)
      );
    } catch (error) {
      console.error(error);
      alert("Error al eliminar logro.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header Bar */}
        <Card className="border-none bg-slate-900 text-white">
          <CardContent className="flex items-center justify-between p-4 flex-wrap gap-4">
            <button
              onClick={() => (window.location.href = "/profesores")}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20"
            >
              <span className="material-icons-round text-sm">arrow_back</span>
              Ver Entrenadores
            </button>
            {isSelf && (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 shadow-md"
              >
                <span className="material-icons-round text-sm">edit</span>
                Editar Perfil
              </button>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left Panel: Photo & Identity */}
          <Card className="md:col-span-1 h-fit">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-xl bg-slate-100">
                {professor.foto ? (
                  <img
                    src={professor.foto}
                    alt={professor.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-800">
                    <span className="material-icons-round text-6xl text-slate-500">
                      sports
                    </span>
                  </div>
                )}
              </div>
              <h2 className="text-2xl leading-tight font-black text-black">
                {professor.nombre.split(" ")[0]}
              </h2>
              <p className="text-lg font-bold text-red-600">
                {professor.nombre.split(" ").slice(1).join(" ")}
              </p>
              <p className="mt-1 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {professor.especialidad || "Entrenador Valle"}
              </p>
            </CardContent>
          </Card>

          {/* Right Panel: Info & Achievements */}
          <div className="space-y-6 md:col-span-2">
            {/* Detailed Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="material-icons-round text-red-600">assignment_ind</span>
                  Información Personal y Profesional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {infoItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-slate-100 pb-3"
                    >
                      <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                        {item.icon}
                        {item.label}
                      </span>
                      <span className="text-right text-sm font-bold text-slate-850 truncate max-w-[200px]" title={item.value}>
                        {item.value || "N/A"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Award className="text-red-600" />
                  Logros Deportivos Registrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievementsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : achievements && achievements.length > 0 ? (
                  <div className="space-y-4">
                    {achievements.map((ach) => (
                      <div
                        key={ach.id}
                        className="rounded-xl border border-slate-150 bg-white p-4 shadow-sm hover:border-red-200 transition-colors flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded">
                              {ach.ano}
                            </span>
                            <span className="text-sm font-bold text-slate-950">
                              Atleta: {ach.atletaNombre}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-500">
                            Evento: <span className="text-slate-700">{ach.campeonato}</span>
                          </p>
                          <p className="text-xs text-slate-600 italic mt-1 font-medium">
                            "{ach.logro}"
                          </p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <span className="material-icons-round text-red-500 shrink-0 select-none">
                            emoji_events
                          </span>
                          {isSelf && (
                            <button
                              onClick={() => handleEditAchievement(ach)}
                              className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                              title="Editar logro"
                            >
                              <span className="material-icons-round text-sm">edit</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center">
                    <span className="material-icons-round mb-2 text-4xl text-slate-350">
                      emoji_events
                    </span>
                    <p className="text-sm font-bold text-muted-foreground">
                      Sin logros registrados por este entrenador
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal Editar Perfil */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="material-icons-round">edit</span> Editar Perfil
              </h3>
              <button onClick={() => setIsProfileModalOpen(false)} className="hover:text-red-400">
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Nombre</label>
                <input
                  type="text"
                  required
                  value={profileForm.nombre}
                  onChange={(e) => setProfileForm({ ...profileForm, nombre: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Especialidad</label>
                  <input
                    type="text"
                    required
                    value={profileForm.especialidad}
                    onChange={(e) => setProfileForm({ ...profileForm, especialidad: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Cédula</label>
                  <input
                    type="text"
                    required
                    value={profileForm.cedula}
                    onChange={(e) => setProfileForm({ ...profileForm, cedula: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Fecha Nacimiento</label>
                  <input
                    type="date"
                    required
                    value={profileForm.fechaNacimiento}
                    onChange={(e) => setProfileForm({ ...profileForm, fechaNacimiento: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Teléfono</label>
                  <input
                    type="tel"
                    value={profileForm.telefono}
                    onChange={(e) => setProfileForm({ ...profileForm, telefono: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Correo</label>
                <input
                  type="email"
                  required
                  value={profileForm.correo}
                  onChange={(e) => setProfileForm({ ...profileForm, correo: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsProfileModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Logro */}
      {isAchievementModalOpen && achievementForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-lg overflow-hidden border-0 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b p-5 bg-gradient-to-r from-red-600 to-red-700 text-white">
              <div className="flex items-center gap-2">
                <Award size={20} />
                <h3 className="font-black text-lg">Editar Logro Deportivo</h3>
              </div>
              <button
                onClick={() => setIsAchievementModalOpen(false)}
                className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span className="material-icons-round text-[20px]">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSaveAchievement} className="p-6 flex flex-col gap-4 bg-white">
              
              {/* 1. Atleta */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Deportista Asociado <span className="text-red-500">*</span>
                </label>
                <select
                  value={achievementForm.atletaId || ""}
                  onChange={(e) => setAchievementForm({ ...achievementForm, atletaId: e.target.value })}
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
                  required
                  value={achievementForm.campeonato}
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    const c = championships?.find(champ => champ.nombre === selectedName);
                    const ano = c && c.fechaInicio ? c.fechaInicio.split("-")[0] : achievementForm.ano;
                    setAchievementForm({ ...achievementForm, campeonato: selectedName, ano });
                  }}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden bg-white"
                >
                  <option value="">Selecciona el campeonato...</option>
                  {championships?.map((c) => (
                    <option key={c.id} value={c.nombre}>
                      {c.nombre} {c.ciudad ? `(${c.ciudad}, ${c.fechaInicio.split("-")[0]})` : ""}
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
                    value={achievementForm.medalla || ""}
                    onChange={(e) => setAchievementForm({ ...achievementForm, medalla: e.target.value })}
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
                    value={achievementForm.prueba || ""}
                    onChange={(e) => setAchievementForm({ ...achievementForm, prueba: e.target.value })}
                    disabled={!achievementForm.atletaId}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden bg-white disabled:bg-slate-50 disabled:text-slate-400"
                    required
                  >
                    {!achievementForm.atletaId ? (
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
                  value={achievementForm.detalles || ""}
                  onChange={(e) => setAchievementForm({ ...achievementForm, detalles: e.target.value })}
                  rows={3}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden resize-none bg-white"
                />
              </div>

              <div className="mt-4 flex justify-between items-center border-t border-slate-100 pt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    handleDeleteAchievement(achievementForm.id);
                    setIsAchievementModalOpen(false);
                  }} 
                  className="flex items-center gap-1 text-red-600 font-bold hover:bg-red-50 px-3 py-2 rounded-xl transition-colors"
                >
                  <span className="material-icons-round text-sm">delete</span> Eliminar
                </button>
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAchievementModalOpen(false)} 
                    className="px-4 py-2 text-slate-600 border border-slate-200 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md transition-all"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export const ProfessorProfile: React.FC<{ id: string }> = ({ id }) => {
  return (
    <QueryProvider>
      <ProfessorProfileInner id={id} />
    </QueryProvider>
  );
};
