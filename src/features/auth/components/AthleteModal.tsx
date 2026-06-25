import React, { useState, useEffect } from "react";
import { AthleteForm } from "./form";

export const AthleteModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [athleteData, setAthleteData] = useState<any>(null);

  useEffect(() => {
    // Bind to window to allow vanilla app.js to open this modal
    (window as any).openAthleteModal = (athlete: any = null) => {
      setAthleteData(athlete);
      setIsOpen(true);
    };

    // Bind close to window just in case
    (window as any).closeAthleteModal = () => {
      setIsOpen(false);
      setAthleteData(null);
    };

    return () => {
      delete (window as any).openAthleteModal;
      delete (window as any).closeAthleteModal;
    };
  }, []);

  if (!isOpen) return null;

  const handleSuccess = (saved: any) => {
    // Trigger the vanilla app.js loadData function to refresh the athlete grid
    if ((window as any).refreshAthletesData) {
      (window as any).refreshAthletesData();
    } else {
      // Fallback in case refresh is not loaded
      window.location.reload();
    }
    setIsOpen(false);
    setAthleteData(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setAthleteData(null);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-4xl w-full p-8 md:p-10 relative my-8 max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="material-icons-round text-red-600 text-3xl">
              {athleteData ? "manage_accounts" : "person_add"}
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {athleteData ? "Editar Perfil del Atleta" : "Registrar Nuevo Atleta"}
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {athleteData ? "Modifica los datos personales y clasificaciones" : "Registra un nuevo atleta en la base de datos"}
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
        <AthleteForm
          initialData={athleteData}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isModal={true}
        />
      </div>
    </div>
  );
};
