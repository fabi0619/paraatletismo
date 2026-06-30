import { c as createComponent } from './astro-component_B7RQoL49.mjs';
import 'piccolore';
import { M as renderComponent, N as renderTemplate } from './transition_D2c4wlGk.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useMemo, useEffect } from 'react';
import { u as useProfessor, a as useProfessorAchievements } from './useProfessors_DnrC_Ykz.mjs';
import { u as useChampionships } from './useChampionships_Cbqq4OpZ.mjs';
import { a as useAthletes } from './useAthletes_BlC5Zdkk.mjs';
import { Q as QueryProvider } from './QueryProvider__3BIDRjC.mjs';
import { useQueryClient } from '@tanstack/react-query';
import { p as professorsService } from './professorsService_B4TlaCRS.mjs';
import { C as Card, d as CardContent, a as CardHeader, b as CardTitle } from './card_B1uvd6Uf.mjs';
import { S as Skeleton } from './skeleton_Bqg0SaSg.mjs';
import { Shield, IdCard, Calendar, Mail, Phone, Award } from 'lucide-react';

const ProfileSkeleton = () => /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-slate-50 px-4 py-6 md:px-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl space-y-6", children: [
  /* @__PURE__ */ jsx(Skeleton, { className: "h-14 w-full rounded-2xl" }),
  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [
    /* @__PURE__ */ jsx(Card, { className: "md:col-span-1", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center gap-4 p-6", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-40 w-40 rounded-full" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-3/4" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-1/2" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-2/3" })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { className: "md:col-span-2", children: /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4 p-6", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-1/3" }),
      [...Array(4)].map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full" }, i))
    ] }) })
  ] })
] }) });
const ProfessorProfileInner = ({ id, initialData }) => {
  const { data: professor, isLoading, isError, error } = useProfessor(id, initialData);
  const { data: achievements, isLoading: achievementsLoading } = useProfessorAchievements(id);
  const { data: championships } = useChampionships();
  const { data: athletes } = useAthletes();
  const [session, setSession] = useState(null);
  const queryClient = useQueryClient();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [achievementForm, setAchievementForm] = useState(null);
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
  if (isLoading) return /* @__PURE__ */ jsx(ProfileSkeleton, {});
  if (isError || !professor) {
    return /* @__PURE__ */ jsxs("div", { className: "flex h-screen flex-col items-center justify-center bg-slate-50 p-8 text-center text-red-600", children: [
      /* @__PURE__ */ jsx("span", { className: "material-icons-round mb-4 text-6xl", children: "error_outline" }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black", children: "Entrenador no encontrado" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: error?.message || "No se pudo cargar la información del entrenador." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => window.location.href = "/profesores",
          className: "mt-6 rounded-lg bg-red-600 px-6 py-2 font-bold text-white",
          children: "Volver a Entrenadores"
        }
      )
    ] });
  }
  const isSelf = session?.id === professor.id || session?.rol === "admin";
  const calculateAge = (birthDate) => {
    if (!birthDate) return "-";
    const ageDifMs = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) + " años";
  };
  const infoItems = [
    { label: "Especialidad", value: professor.especialidad, icon: /* @__PURE__ */ jsx(Shield, { size: 16, className: "text-red-500" }) },
    { label: "Cédula", value: professor.cedula, icon: /* @__PURE__ */ jsx(IdCard, { size: 16, className: "text-slate-500" }) },
    { label: "Edad", value: professor.fechaNacimiento ? `${calculateAge(professor.fechaNacimiento)} (${professor.fechaNacimiento})` : "N/A", icon: /* @__PURE__ */ jsx(Calendar, { size: 16, className: "text-green-500" }) },
    { label: "Correo", value: professor.correo, icon: /* @__PURE__ */ jsx(Mail, { size: 16, className: "text-orange-500" }) },
    { label: "Teléfono", value: professor.telefono || "N/A", icon: /* @__PURE__ */ jsx(Phone, { size: 16, className: "text-teal-500" }) },
    { label: "Género", value: professor.genero || "N/A", icon: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-sm text-purple-500", children: "transgender" }) }
  ];
  const handleEditClick = () => {
    setIsProfileModalOpen(true);
  };
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!professor) return;
    try {
      const updated = { ...professor, ...profileForm };
      await professorsService.saveProfessor(updated);
      queryClient.setQueryData(["professor", id], updated);
      queryClient.invalidateQueries({ queryKey: ["professors"] });
      setIsProfileModalOpen(false);
    } catch (error2) {
      console.error(error2);
      alert("Error al guardar perfil.");
    }
  };
  const handleEditAchievement = (ach) => {
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
  const handleSaveAchievement = async (e) => {
    e.preventDefault();
    if (!achievementForm) return;
    const logroText = `Obtuvo Medalla de ${achievementForm.medalla} en la prueba de ${achievementForm.prueba}.${achievementForm.detalles.trim() ? ` Detalle: ${achievementForm.detalles.trim()}` : ""}`;
    const payloadToSave = { ...achievementForm, logro: logroText };
    try {
      await professorsService.updateAchievement(achievementForm.id, payloadToSave);
      queryClient.setQueryData(
        ["professorAchievements", id],
        (old) => (old || []).map((a) => a.id === achievementForm.id ? { ...a, ...payloadToSave } : a)
      );
      setIsAchievementModalOpen(false);
      setAchievementForm(null);
    } catch (error2) {
      console.error(error2);
      alert("Error al guardar logro.");
    }
  };
  const handleDeleteAchievement = async (logroId) => {
    if (!confirm("¿Seguro que deseas eliminar este logro?")) return;
    try {
      await professorsService.deleteAchievement(logroId);
      queryClient.setQueryData(
        ["professorAchievements", id],
        (old) => (old || []).filter((a) => a.id !== logroId)
      );
    } catch (error2) {
      console.error(error2);
      alert("Error al eliminar logro.");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-slate-50 px-4 py-6 md:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl space-y-6", children: [
      /* @__PURE__ */ jsxs(Card, { className: "border-white/60 shadow-xl rounded-3xl bg-white/60 backdrop-blur-xl relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsxs(CardContent, { className: "flex items-center justify-between p-4 px-6 relative z-10 flex-wrap gap-4", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => window.location.href = "/profesores",
              className: "flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-sm font-black text-slate-800 transition-all hover:-translate-x-1 hover:shadow-md hover:bg-white border border-white shadow-sm",
              children: [
                /* @__PURE__ */ jsx("span", { className: "material-icons-round text-red-600 text-[18px]", children: "arrow_back" }),
                "Ver Entrenadores"
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex items-center gap-2 text-slate-700 bg-white/50 px-4 py-1.5 rounded-full border border-white/60 shadow-sm", children: [
              /* @__PURE__ */ jsx("span", { className: "material-icons-round text-red-600 text-lg", children: "admin_panel_settings" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-black tracking-widest uppercase", children: "Perfil de Entrenador" })
            ] }),
            isSelf && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleEditClick,
                className: "flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-5 py-2 text-sm font-black text-white transition-all hover:shadow-lg hover:scale-105 border border-red-400 shadow-sm",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "material-icons-round text-[18px]", children: "edit" }),
                  "Editar Perfil"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs(Card, { className: "md:col-span-1 h-fit overflow-hidden border-white/50 shadow-xl rounded-3xl bg-white/50 backdrop-blur-xl relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-red-600/20 to-transparent pointer-events-none" }),
          /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center p-8 text-center relative z-10", children: [
            /* @__PURE__ */ jsx("div", { className: "mb-5 h-44 w-44 overflow-hidden rounded-full border-4 border-white shadow-2xl relative bg-slate-100", children: professor.foto ? /* @__PURE__ */ jsx(
              "img",
              {
                src: professor.foto,
                alt: professor.nombre,
                className: "h-full w-full object-cover"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center bg-slate-800", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-6xl text-slate-500", children: "sports" }) }) }),
            /* @__PURE__ */ jsx("h2", { className: "text-3xl leading-tight font-black text-slate-900 drop-shadow-sm", children: professor.nombre.split(" ")[0] }),
            /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-red-600 tracking-tight drop-shadow-sm", children: professor.nombre.split(" ").slice(1).join(" ") }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 px-4 py-1.5 bg-white/80 rounded-full border border-white shadow-sm flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx("span", { className: "material-icons-round text-[16px] text-slate-400", children: "shield" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-700 uppercase tracking-wider", children: professor.especialidad || "Entrenador Valle" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6 md:col-span-2", children: [
          /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden border-white/60 shadow-xl rounded-3xl bg-white/60 backdrop-blur-xl relative", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-4 border-b border-white/40 bg-white/30", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-slate-800 font-black", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-red-100 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-red-600 text-lg", children: "assignment_ind" }) }),
              "Información Personal y Profesional"
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: infoItems.map((item) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "flex flex-col gap-1.5 border-b border-white/40 pb-3",
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-1.5", children: [
                    item.icon,
                    item.label
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800 text-[15px] truncate", title: item.value, children: item.value || "N/A" })
                ]
              },
              item.label
            )) }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden border-white/60 shadow-xl rounded-3xl bg-white/60 backdrop-blur-xl relative", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-4 border-b border-white/40 bg-white/30", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-slate-800 font-black", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(Award, { size: 18, className: "text-yellow-600" }) }),
              "Logros Deportivos Registrados"
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-6", children: achievementsLoading ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full rounded-2xl" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-full rounded-2xl" })
            ] }) : achievements && achievements.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-4", children: achievements.map((ach) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "rounded-2xl border border-white/60 bg-white/50 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:bg-white/70 relative overflow-hidden group flex items-start justify-between gap-4",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2 relative z-10", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-black text-red-700 bg-red-100/80 border border-red-200/50 px-3 py-1 rounded-full shadow-sm", children: ach.ano }),
                      /* @__PURE__ */ jsxs("span", { className: "text-sm font-black text-slate-800", children: [
                        "Atleta: ",
                        /* @__PURE__ */ jsx("span", { className: "text-red-600", children: ach.atletaNombre })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs font-black tracking-wide text-slate-500 uppercase", children: [
                      "Evento: ",
                      /* @__PURE__ */ jsx("span", { className: "text-slate-700", children: ach.campeonato })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-700 font-medium italic mt-1 pl-3 border-l-2 border-red-300", children: [
                      '"',
                      ach.logro,
                      '"'
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2 relative z-10", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-md text-white", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round shrink-0 select-none drop-shadow-sm", children: "emoji_events" }) }),
                    isSelf && /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => handleEditAchievement(ach),
                        className: "rounded-full bg-white/80 p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 border border-white shadow-sm transition-all hover:scale-110 mt-1",
                        title: "Editar logro",
                        children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-[16px]", children: "edit" })
                      }
                    )
                  ] })
                ]
              },
              ach.id
            )) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center rounded-2xl border border-white/40 bg-white/40 p-12 text-center shadow-inner", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-slate-200/50 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-3xl text-slate-400", children: "emoji_events" }) }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-black text-slate-500", children: "Sin logros registrados por este entrenador" })
            ] }) })
          ] })
        ] })
      ] })
    ] }),
    isProfileModalOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 p-4 text-white flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-bold text-lg flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "material-icons-round", children: "edit" }),
          " Editar Perfil"
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsProfileModalOpen(false), className: "hover:text-red-400", children: /* @__PURE__ */ jsx("span", { className: "material-icons-round", children: "close" }) })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSaveProfile, className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-bold uppercase text-slate-500", children: "Nombre" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              required: true,
              value: profileForm.nombre,
              onChange: (e) => setProfileForm({ ...profileForm, nombre: e.target.value }),
              className: "w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold uppercase text-slate-500", children: "Especialidad" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                required: true,
                value: profileForm.especialidad,
                onChange: (e) => setProfileForm({ ...profileForm, especialidad: e.target.value }),
                className: "w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold uppercase text-slate-500", children: "Cédula" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                required: true,
                value: profileForm.cedula,
                onChange: (e) => setProfileForm({ ...profileForm, cedula: e.target.value }),
                className: "w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold uppercase text-slate-500", children: "Fecha Nacimiento" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                required: true,
                value: profileForm.fechaNacimiento,
                onChange: (e) => setProfileForm({ ...profileForm, fechaNacimiento: e.target.value }),
                className: "w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold uppercase text-slate-500", children: "Teléfono" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "tel",
                value: profileForm.telefono,
                onChange: (e) => setProfileForm({ ...profileForm, telefono: e.target.value }),
                className: "w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-bold uppercase text-slate-500", children: "Correo" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              required: true,
              value: profileForm.correo,
              onChange: (e) => setProfileForm({ ...profileForm, correo: e.target.value }),
              className: "w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-4 flex justify-end gap-3", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsProfileModalOpen(false), className: "px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg", children: "Cancelar" }),
          /* @__PURE__ */ jsx("button", { type: "submit", className: "px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700", children: "Guardar Cambios" })
        ] })
      ] })
    ] }) }),
    isAchievementModalOpen && achievementForm && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs", children: /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-lg overflow-hidden border-0 shadow-2xl animate-in fade-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b p-5 bg-gradient-to-r from-red-600 to-red-700 text-white", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Award, { size: 20 }),
          /* @__PURE__ */ jsx("h3", { className: "font-black text-lg", children: "Editar Logro Deportivo" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsAchievementModalOpen(false),
            className: "rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors",
            children: /* @__PURE__ */ jsx("span", { className: "material-icons-round text-[20px]", children: "close" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSaveAchievement, className: "p-6 flex flex-col gap-4 bg-white", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxs("label", { className: "text-xs font-bold text-slate-600 uppercase tracking-wider", children: [
            "Deportista Asociado ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: achievementForm.atletaId || "",
              onChange: (e) => setAchievementForm({ ...achievementForm, atletaId: e.target.value }),
              className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden bg-white",
              required: true,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Selecciona el atleta..." }),
                athletes?.map((a) => /* @__PURE__ */ jsxs("option", { value: a.id, children: [
                  a.nombre,
                  " (",
                  a.claseDeportiva ? `Clase ${a.claseDeportiva}` : "Sin clasificación",
                  ")"
                ] }, a.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxs("label", { className: "text-xs font-bold text-slate-600 uppercase tracking-wider", children: [
            "Campeonato / Evento Oficial ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              required: true,
              value: achievementForm.campeonato,
              onChange: (e) => {
                const selectedName = e.target.value;
                const c = championships?.find((champ) => champ.nombre === selectedName);
                const ano = c && c.fechaInicio ? c.fechaInicio.split("-")[0] : achievementForm.ano;
                setAchievementForm({ ...achievementForm, campeonato: selectedName, ano });
              },
              className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden bg-white",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Selecciona el campeonato..." }),
                championships?.map((c) => /* @__PURE__ */ jsxs("option", { value: c.nombre, children: [
                  c.nombre,
                  " ",
                  c.ciudad ? `(${c.ciudad}, ${c.fechaInicio.split("-")[0]})` : ""
                ] }, c.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-xs font-bold text-slate-600 uppercase tracking-wider", children: [
              "Medalla lograda ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: achievementForm.medalla || "",
                onChange: (e) => setAchievementForm({ ...achievementForm, medalla: e.target.value }),
                className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden bg-white",
                required: true,
                children: [
                  /* @__PURE__ */ jsx("option", { value: "Oro", children: "Oro" }),
                  /* @__PURE__ */ jsx("option", { value: "Plata", children: "Plata" }),
                  /* @__PURE__ */ jsx("option", { value: "Bronce", children: "Bronce" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxs("label", { className: "text-xs font-bold text-slate-600 uppercase tracking-wider", children: [
              "Prueba en la que compitió ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: achievementForm.prueba || "",
                onChange: (e) => setAchievementForm({ ...achievementForm, prueba: e.target.value }),
                disabled: !achievementForm.atletaId,
                className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden bg-white disabled:bg-slate-50 disabled:text-slate-400",
                required: true,
                children: !achievementForm.atletaId ? /* @__PURE__ */ jsx("option", { value: "", children: "Selecciona primero un atleta..." }) : availablePruebas.map((p) => /* @__PURE__ */ jsx("option", { value: p, children: p }, p))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-600 uppercase tracking-wider", children: "Detalles Adicionales (Opcional)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: achievementForm.detalles || "",
              onChange: (e) => setAchievementForm({ ...achievementForm, detalles: e.target.value }),
              rows: 3,
              className: "rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-hidden resize-none bg-white"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-between items-center border-t border-slate-100 pt-4", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                handleDeleteAchievement(achievementForm.id);
                setIsAchievementModalOpen(false);
              },
              className: "flex items-center gap-1 text-red-600 font-bold hover:bg-red-50 px-3 py-2 rounded-xl transition-colors",
              children: [
                /* @__PURE__ */ jsx("span", { className: "material-icons-round text-sm", children: "delete" }),
                " Eliminar"
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setIsAchievementModalOpen(false),
                className: "px-4 py-2 text-slate-600 border border-slate-200 font-bold hover:bg-slate-50 rounded-xl transition-colors",
                children: "Cancelar"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md transition-all",
                children: "Guardar Cambios"
              }
            )
          ] })
        ] })
      ] })
    ] }) })
  ] });
};
const ProfessorProfile = ({ id, initialData }) => {
  return /* @__PURE__ */ jsx(QueryProvider, { children: /* @__PURE__ */ jsx(ProfessorProfileInner, { id, initialData }) });
};

const $$ProfessorIsland = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ProfessorIsland;
  const { id } = Astro2.props;
  let initialData = null;
  try {
    initialData = await professorsService.getProfessorById(id);
  } catch (e) {
    console.error("Error fetching professor in Server Island:", e);
  }
  return renderTemplate`${renderComponent($$result, "ProfessorProfile", ProfessorProfile, { "client:load": true, "id": id, "initialData": initialData, "client:component-hydration": "load", "client:component-path": "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/features/professors/components/ProfessorProfile", "client:component-export": "ProfessorProfile" })}`;
}, "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/components/islands/ProfessorIsland.astro", void 0);

const $$file = "C:/Users/faroa/OneDrive/Escritorio/paraatletismo/src/components/islands/ProfessorIsland.astro";
const $$url = undefined;

export { $$ProfessorIsland as $, ProfileSkeleton as P, $$file as a, $$url as b };
