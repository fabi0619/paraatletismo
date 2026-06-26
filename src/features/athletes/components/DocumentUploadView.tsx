import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE_MB = 2; // Límite para no saturar la base de datos

export const DocumentUploadView: React.FC = () => {
  const [files, setFiles] = useState<(File | null)[]>(Array(8).fill(null));
  const [errors, setErrors] = useState<string[]>(Array(8).fill(""));

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const newErrors = [...errors];
    const newFiles = [...files];

    if (file) {
      if (file.type !== "application/pdf") {
        newErrors[index] = "Solo se permiten archivos PDF.";
        newFiles[index] = null;
      } else if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        newErrors[index] = `El archivo excede el límite de ${MAX_FILE_SIZE_MB}MB.`;
        newFiles[index] = null;
      } else {
        newErrors[index] = "";
        newFiles[index] = file;
      }
    } else {
      newFiles[index] = null;
      newErrors[index] = "";
    }
    
    setFiles(newFiles);
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const uploadedCount = files.filter(f => f !== null).length;
    if (uploadedCount === 0) {
      alert("Por favor selecciona al menos un documento para cargar.");
      return;
    }
    // Aquí puedes añadir la lógica de subida (ej. a Supabase Storage)
    alert(`Has cargado ${uploadedCount} documento(s) correctamente.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card className="border-none bg-slate-900 shadow-lg">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20"
            >
              <span className="material-icons-round text-sm">arrow_back</span>
              Volver al Dashboard
            </button>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span className="material-icons-round text-red-500">picture_as_pdf</span>
              Carga de Documentos
            </h2>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100 pb-6">
            <CardTitle className="text-2xl font-black text-slate-800">Sube tus archivos PDF</CardTitle>
            <CardDescription className="text-base text-slate-500 font-medium mt-1">
              Selecciona hasta 8 documentos requeridos. Para mantener el rendimiento de la plataforma, los documentos tienen un límite de tamaño de <strong className="text-red-600">{MAX_FILE_SIZE_MB}MB</strong> por archivo.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-slate-50/50">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {files.map((file, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-red-300 hover:shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700 font-black text-sm">
                        {index + 1}
                      </div>
                      <label className="text-base font-bold text-slate-700">
                        Documento {index + 1}
                      </label>
                    </div>
                    
                    <div className="relative mt-2">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(index, e)}
                        className="w-full text-sm text-slate-500 
                        file:mr-4 file:rounded-full file:border-0 
                        file:bg-slate-100 file:px-4 file:py-2 file:text-sm 
                        file:font-bold file:text-slate-700 
                        hover:file:bg-slate-200 hover:file:cursor-pointer transition-colors"
                      />
                    </div>
                    
                    <div className="h-8 flex flex-col justify-end">
                      {errors[index] && (
                        <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                          <span className="material-icons-round text-[14px]">error</span>
                          {errors[index]}
                        </p>
                      )}
                      {file && (
                        <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <span className="material-icons-round text-[14px]">check_circle</span>
                          {file.name.length > 20 ? file.name.substring(0, 20) + "..." : file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-700 text-white font-black px-8 py-6 rounded-xl shadow-lg shadow-red-600/20 text-lg transition-transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span className="material-icons-round">cloud_upload</span>
                  Guardar Documentos
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
