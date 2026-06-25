import React, { useState, useEffect } from "react";
import { CoachForm } from "./form";

export const CoachModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [coachData, setCoachData] = useState<any>(null);

  useEffect(() => {
    // Bind to window to allow app components/pages to open this modal
    (window as any).openCoachModal = (coach: any = null) => {
      setCoachData(coach);
      setIsOpen(true);
    };

    // Bind close to window just in case
    (window as any).closeCoachModal = () => {
      setIsOpen(false);
      setCoachData(null);
    };

    return () => {
      delete (window as any).openCoachModal;
      delete (window as any).closeCoachModal;
    };
  }, []);

  if (!isOpen) return null;

  const handleSuccess = (saved: any) => {
    // Trigger session update and reload to reflect changes
    try {
      const sesion = localStorage.getItem("sesion_usuario");
      if (sesion) {
        const parsed = JSON.parse(sesion);
        if (parsed.id === saved.id) {
          const updatedSesion = {
            ...parsed,
            nombre: saved.nombre,
            especialidad: saved.especialidad,
            cedula: saved.cedula,
            foto: saved.foto,
            club: saved.club
          };
          localStorage.setItem("sesion_usuario", JSON.stringify(updatedSesion));
          // Dispatch custom event to notify Header
          window.dispatchEvent(new Event("sesion_change"));
        }
      }
    } catch (e) {
      console.error("Error updating session storage", e);
    }
    
    // Reload/refresh to show new data
    window.location.reload();
    setIsOpen(false);
    setCoachData(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setCoachData(null);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-4xl w-full p-8 md:p-10 relative my-8 max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="material-icons-round text-red-600 text-3xl">
              manage_accounts
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Editar Perfil del Entrenador
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Modifica tus datos personales, de contacto y especialidad
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-icons-round text-lg">close</span>
          </button>
        </div>

        {/* Reusable Form */}
        <CoachForm
          initialData={coachData}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};
