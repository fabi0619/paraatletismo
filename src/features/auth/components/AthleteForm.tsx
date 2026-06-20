import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerAthleteSchema,
  editAthleteSchema,
  type RegisterAthleteInput,
} from "../schemas/authSchemas";
import { saveAthlete } from "../../../lib/supabase";
import { CLASES_DEPORTIVAS, DISCAPACIDADES } from "../../../lib/classes";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";

const CLUBS = [
  "Club Deportivo Imparables a la Meta",
  "Club Deportivo Minas del Paraatletismo",
  "Club Deportivo Discatle",
  "Club Deportivo de Paraatletismo PC Yumbo",
  "Club Deportivo Casin",
];

interface AthleteFormProps {
  initialData?: any;
  onSuccess?: (savedData: any) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const AthleteForm: React.FC<AthleteFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
  isModal = false,
}) => {
  const isEditing = !!initialData;
  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isEditing ? editAthleteSchema : registerAthleteSchema),
    defaultValues: {
      nombre: "",
      cedula: "",
      fechaNacimiento: "",
      genero: "Masculino",
      telefono: "",
      correo: "",
      password: "",
      club: "",
      discapacidad: "",
      tipoClase: "",
      claseDeportiva: "",
      foto: "",
    },
  });

  // Watch form values for live preview and dynamic selects
  const formValues = useWatch({ control });
  const [availableClasses, setAvailableClasses] = useState<typeof CLASES_DEPORTIVAS>([]);
  const [selectedClassInfo, setSelectedClassInfo] = useState<string | null>(null);

  const watchDiscapacidad = formValues.discapacidad;
  const watchTipoClase = formValues.tipoClase;
  const watchClaseDeportiva = formValues.claseDeportiva;

  // Populate data when editing
  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        nombre: initialData.nombre || "",
        cedula: initialData.cedula || "",
        fechaNacimiento: initialData.fechaNacimiento || "",
        genero: initialData.genero || "Masculino",
        telefono: initialData.telefono || "",
        correo: initialData.correo || "",
        password: "",
        club: initialData.club || "",
        discapacidad: initialData.discapacidad || "",
        tipoClase: initialData.tipoClase || "",
        claseDeportiva: initialData.claseDeportiva || "",
        foto: initialData.foto || "",
      });
      setPhotoBase64(initialData.foto || undefined);
    } else {
      reset({
        nombre: "",
        cedula: "",
        fechaNacimiento: "",
        genero: "Masculino",
        telefono: "",
        correo: "",
        password: "",
        club: "",
        discapacidad: "",
        tipoClase: "",
        claseDeportiva: "",
        foto: "",
      });
      setPhotoBase64(undefined);
    }
    setGeneralError(null);
  }, [initialData, reset]);

  // Handle disability changes
  useEffect(() => {
    if (!watchDiscapacidad) {
      setAvailableClasses([]);
      setSelectedClassInfo(null);
      return;
    }
  }, [watchDiscapacidad]);

  // Handle modality changes
  useEffect(() => {
    if (!watchDiscapacidad || !watchTipoClase) {
      setAvailableClasses([]);
      setSelectedClassInfo(null);
      return;
    }

    const filtered = CLASES_DEPORTIVAS.filter(
      (c) => c.discapacidad === watchDiscapacidad && c.tipo === watchTipoClase
    );
    setAvailableClasses(filtered);

    // Only reset claseDeportiva if it is not the initial edit value
    if (initialData && initialData.discapacidad === watchDiscapacidad && initialData.tipoClase === watchTipoClase && watchClaseDeportiva === initialData.claseDeportiva) {
      // Keep it
    } else {
      // Only clear if the user is changing it
      if (watchClaseDeportiva && !filtered.some((c) => c.clase === watchClaseDeportiva)) {
        setValue("claseDeportiva", "");
        setSelectedClassInfo(null);
      }
    }
  }, [watchDiscapacidad, watchTipoClase, setValue, initialData]);

  // Handle sport class changes to update description
  useEffect(() => {
    if (!watchClaseDeportiva) {
      setSelectedClassInfo(null);
      return;
    }

    const classInfo = CLASES_DEPORTIVAS.find((c) => c.clase === watchClaseDeportiva);
    setSelectedClassInfo(classInfo ? classInfo.descripcion : null);
  }, [watchClaseDeportiva]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor, suba únicamente imágenes (.jpg, .png, .jpeg)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPhotoBase64(base64);
      setValue("foto", base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoBase64(undefined);
    setValue("foto", "");
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setGeneralError(null);
    try {
      const payload = { ...data };
      if (isEditing && !payload.password) {
        delete payload.password;
      }
      
      const saved = await saveAthlete(payload);
      if (onSuccess) {
        onSuccess(saved);
      }
    } catch (error: any) {
      setGeneralError(error.message || "Ocurrió un error al guardar los datos del atleta.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {generalError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-600 leading-relaxed animate-fade-in">
          {generalError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Foto y Vista Previa */}
        <div className="lg:col-span-4 space-y-8">
          {/* Subida de foto */}
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col items-center">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 self-start">
              Foto de Perfil
            </span>
            <div
              onClick={() => document.getElementById("athlete-modal-avatar-upload")?.click()}
              className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-red-500 cursor-pointer flex flex-col items-center justify-center bg-white transition-colors duration-200 relative group"
            >
              {photoBase64 ? (
                <img src={photoBase64} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <span className="material-icons-round text-slate-400 text-3xl group-hover:text-red-500 transition-colors">
                    add_a_photo
                  </span>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wide">
                    Subir Foto
                  </p>
                </div>
              )}
            </div>
            <input
              id="athlete-modal-avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={isLoading}
            />
            {photoBase64 && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={isLoading}
                className="mt-4 flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer transition-colors"
              >
                <span className="material-icons-round text-sm">delete</span>
                Eliminar Foto
              </button>
            )}
          </div>

          {/* Vista previa de tarjeta */}
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
              Vista Previa de Tarjeta
            </span>

            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex gap-4 items-center animate-fade-in">
              <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-slate-100 flex-shrink-0 border-2 border-red-500/20">
                {photoBase64 ? (
                  <img src={photoBase64} className="w-full h-full object-cover" alt="Card Preview" />
                ) : (
                  <span className="material-icons-round text-slate-300 text-3xl">person</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {formValues.nombre || "Nombre del Atleta"}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mt-0.5">
                  {formValues.club || "Atleta Valle Oro Puro"}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {watchDiscapacidad && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-md border border-red-100 capitalize">
                      {DISCAPACIDADES[watchDiscapacidad as keyof typeof DISCAPACIDADES]?.nombre.replace(
                        "Discapacidad ",
                        ""
                      ) || watchDiscapacidad}
                    </span>
                  )}
                  {watchClaseDeportiva && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md border border-slate-200">
                      {watchClaseDeportiva}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Campos de información */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
            Datos Personales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 grid gap-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                placeholder="Ej. Mauricio Valencia"
                disabled={isLoading}
                {...register("nombre")}
              />
              {errors.nombre && (
                <span className="text-xs text-red-500 font-medium">{errors.nombre?.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cedula">Cédula / Identificación</Label>
              <Input
                id="cedula"
                placeholder="Ej. 111820495"
                disabled={isLoading}
                {...register("cedula")}
              />
              {errors.cedula && (
                <span className="text-xs text-red-500 font-medium">{errors.cedula?.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
              <Input
                id="fechaNacimiento"
                type="date"
                disabled={isLoading}
                {...register("fechaNacimiento")}
              />
              {errors.fechaNacimiento && (
                <span className="text-xs text-red-500 font-medium">{errors.fechaNacimiento?.message}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 select-none">
                Género <span className="text-red-500 ml-1 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("genero")}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 bg-white text-slate-800 border rounded-xl text-sm font-medium outline-none appearance-none transition-all duration-200
                    ${errors.genero ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-red-500"}`}
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
                <span className="material-icons-round absolute right-4 top-3.5 text-slate-400 pointer-events-none">
                  expand_more
                </span>
              </div>
              {errors.genero && (
                <span className="text-xs font-semibold text-red-500 mt-2">{errors.genero.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="telefono">Teléfono de Contacto</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="Ej. +57 300 123 4567"
                disabled={isLoading}
                {...register("telefono")}
              />
              {errors.telefono && (
                <span className="text-xs text-red-500 font-medium">{errors.telefono?.message}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="correo">Correo Electrónico <span className="text-red-500 ml-1 font-bold">*</span></Label>
              <Input
                id="correo"
                type="email"
                placeholder="Ej. atleta@valle.co"
                disabled={isLoading}
                {...register("correo")}
              />
              {errors.correo && (
                <span className="text-xs text-red-500 font-medium">{errors.correo?.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password">
                {isEditing ? "Nueva Contraseña (dejar vacío para no cambiar)" : "Contraseña de Ingreso"}
                {!isEditing && <span className="text-red-500 ml-1 font-bold">*</span>}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Crea tu contraseña"
                disabled={isLoading}
                {...register("password")}
              />
              {errors.password && (
                <span className="text-xs text-red-500 font-medium">{errors.password?.message}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 select-none">
                Club <span className="text-red-500 ml-1 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("club")}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 bg-white text-slate-800 border rounded-xl text-sm font-medium outline-none appearance-none transition-all duration-200
                    ${errors.club ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-red-500"}`}
                >
                  <option value="">Seleccione un club...</option>
                  {CLUBS.map((club) => (
                    <option key={club} value={club}>
                      {club}
                    </option>
                  ))}
                </select>
                <span className="material-icons-round absolute right-4 top-3.5 text-slate-400 pointer-events-none">
                  expand_more
                </span>
              </div>
              {errors.club && (
                <span className="text-xs font-semibold text-red-500 mt-2">{errors.club.message}</span>
              )}
            </div>
          </div>

          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 pt-4">
            Clasificación Deportiva
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tipo de Discapacidad */}
            <div className="flex flex-col">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 select-none">
                Discapacidad <span className="text-red-500 ml-1 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("discapacidad")}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 bg-white text-slate-800 border rounded-xl text-sm font-medium outline-none appearance-none transition-all duration-200
                    ${errors.discapacidad ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-red-500"}`}
                >
                  <option value="">Seleccione...</option>
                  {Object.entries(DISCAPACIDADES).map(([key, discObj]) => (
                    <option key={key} value={key}>
                      {discObj.nombre}
                    </option>
                  ))}
                </select>
                <span className="material-icons-round absolute right-4 top-3.5 text-slate-400 pointer-events-none">
                  expand_more
                </span>
              </div>
              {errors.discapacidad && (
                <span className="text-xs font-semibold text-red-500 mt-2">{errors.discapacidad.message}</span>
              )}
            </div>

            {/* Modalidad */}
            <div className="flex flex-col">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 select-none">
                Modalidad <span className="text-red-500 ml-1 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("tipoClase")}
                  disabled={!watchDiscapacidad || isLoading}
                  className={`w-full px-4 py-3 bg-white text-slate-800 border rounded-xl text-sm font-medium outline-none appearance-none transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-400
                    ${errors.tipoClase ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-red-500"}`}
                >
                  <option value="">Primero elija discapacidad...</option>
                  <option value="pista">Pista (T)</option>
                  <option value="campo">Campo (F)</option>
                </select>
                <span className="material-icons-round absolute right-4 top-3.5 text-slate-400 pointer-events-none">
                  expand_more
                </span>
              </div>
              {errors.tipoClase && (
                <span className="text-xs font-semibold text-red-500 mt-2">{errors.tipoClase.message}</span>
              )}
            </div>

            {/* Clase Deportiva */}
            <div className="flex flex-col">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 select-none">
                Clase Deportiva <span className="text-red-500 ml-1 font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("claseDeportiva")}
                  disabled={!watchTipoClase || isLoading}
                  className={`w-full px-4 py-3 bg-white text-slate-800 border rounded-xl text-sm font-medium outline-none appearance-none transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-400
                    ${errors.claseDeportiva ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-red-500"}`}
                >
                  <option value="">Primero elija modalidad...</option>
                  {availableClasses.map((item) => (
                    <option key={item.clase} value={item.clase}>
                      {item.clase}
                    </option>
                  ))}
                </select>
                <span className="material-icons-round absolute right-4 top-3.5 text-slate-400 pointer-events-none">
                  expand_more
                </span>
              </div>
              {errors.claseDeportiva && (
                <span className="text-xs font-semibold text-red-500 mt-2">{errors.claseDeportiva.message}</span>
              )}
            </div>
          </div>

          {/* Caja informativa de clase deportiva */}
          {selectedClassInfo && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 text-xs text-slate-700 leading-relaxed font-medium animate-fade-in">
              <span className="material-icons-round text-red-500 text-lg flex-shrink-0">info</span>
              <p>{selectedClassInfo}</p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="btn btn-secondary py-3 px-6 rounded-2xl font-bold select-none cursor-pointer"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-red-600/20 transition-all duration-200 select-none cursor-pointer"
            >
              {isLoading ? (
                <span className="animate-pulse">Guardando...</span>
              ) : (
                <>
                  <span className="material-icons-round text-lg">save</span>
                  {isEditing ? "Guardar Cambios" : "Guardar Atleta e Ingresar"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
