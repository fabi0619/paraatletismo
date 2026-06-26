import React, { useState, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerCoachSchema,
  editCoachSchema,
} from "../../schemas/authSchemas";
import { saveProfessor } from "../../../../lib/supabase";
import { Button } from "@/components/ui/button";
import { TextField, SelectField, DateField } from "../fields";
import { FormStep } from "./FormStep";
import { Save } from "lucide-react";

interface CoachFormProps {
  initialData?: any;
  onSuccess?: (savedData: any) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  setIsLoading?: (val: boolean) => void;
  setGeneralError?: (val: string | null) => void;
}

export const CoachForm: React.FC<CoachFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
  isLoading: externalIsLoading,
  setIsLoading: externalSetIsLoading,
  setGeneralError: externalSetGeneralError,
}) => {
  const isEditing = !!initialData;
  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [localGeneralError, setLocalGeneralError] = useState<string | null>(null);

  const isLoading = externalIsLoading !== undefined ? externalIsLoading : localIsLoading;
  const setIsLoading = externalSetIsLoading || setLocalIsLoading;
  const setGeneralError = externalSetGeneralError || setLocalGeneralError;
  const generalError = externalSetGeneralError ? null : localGeneralError;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(isEditing ? editCoachSchema : registerCoachSchema),
    defaultValues: {
      nombre: "",
      cedula: "",
      fechaNacimiento: "",
      genero: "Masculino",
      telefono: "",
      especialidad: "",
      correo: "",
      password: "",
      foto: "",
    },
    mode: "onTouched",
  });

  const formValues = useWatch({ control });

  // Reset form with initial data when in editing mode
  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        nombre: initialData.nombre || "",
        cedula: initialData.cedula || "",
        fechaNacimiento: initialData.fechaNacimiento || "",
        genero: initialData.genero || "Masculino",
        telefono: initialData.telefono || "",
        especialidad: initialData.especialidad || "",
        correo: initialData.correo || "",
        password: "",
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
        especialidad: "",
        correo: "",
        password: "",
        foto: "",
      });
      setPhotoBase64(undefined);
    }
    setGeneralError(null);
  }, [initialData, reset]);

  // Handle Photo uploading
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
      if (isEditing && initialData?.id) payload.id = initialData.id;
      if (isEditing && !payload.password) delete payload.password;
      const saved = await saveProfessor(payload);

      if (onSuccess) {
        onSuccess({ ...saved, ...data });
      } else {
        // Fallback for register view if no onSuccess was passed (e.g. legacy container logic)
        window.location.href = "/login";
      }
    } catch (error: any) {
      setGeneralError(
        error.message || "Ocurrió un error al guardar los datos del entrenador.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {generalError && (
        <div className="animate-fade-in rounded-2xl border border-red-200 bg-red-50 p-4 text-xs leading-relaxed font-semibold text-red-600">
          {generalError}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Panel: Photo & Card Preview */}
        <div className="space-y-8 lg:col-span-4">
          <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <span className="mb-4 block self-start text-xs font-bold tracking-wider text-slate-700 uppercase">
              Foto de Perfil
            </span>
            <div
              onClick={() =>
                document
                  .getElementById("coach-modal-avatar-upload")
                  ?.click()
              }
              className="group relative flex h-32 w-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-white transition-colors duration-200 hover:border-red-500"
            >
              {photoBase64 ? (
                <img
                  src={photoBase64}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="p-4 text-center">
                  <span className="material-icons-round text-3xl text-slate-400 transition-colors group-hover:text-red-500">
                    add_a_photo
                  </span>
                  <p className="mt-2 text-[10px] font-bold tracking-wide text-slate-400 uppercase">
                    Subir Foto
                  </p>
                </div>
              )}
            </div>
            <input
              id="coach-modal-avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={isLoading}
            />
            {photoBase64 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemovePhoto}
                disabled={isLoading}
                className="mt-4 text-xs font-bold text-red-600 hover:text-red-700"
              >
                <span className="material-icons-round text-sm">delete</span>
                Eliminar Foto
              </Button>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <span className="mb-4 block text-xs font-bold tracking-wider text-slate-700 uppercase">
              Vista Previa
            </span>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-red-500/20 bg-slate-100">
                {photoBase64 ? (
                  <img
                    src={photoBase64}
                    className="h-full w-full object-cover"
                    alt="Card Preview"
                  />
                ) : (
                  <span className="material-icons-round text-3xl text-slate-300">
                    sports
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-bold text-slate-900">
                  {formValues.nombre || "Nombre del Entrenador"}
                </h4>
                <p className="mt-0.5 truncate text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {formValues.especialidad || "Especialidad"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Form Fields */}
        <div className="space-y-6 lg:col-span-8">
          <FormStep title="Información General">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <TextField
                  id="nombre"
                  label="Nombre Completo"
                  required
                  placeholder="Ej. Carlos Arias"
                  disabled={isLoading}
                  error={errors.nombre?.message}
                  {...register("nombre")}
                />
              </div>
              <div>
                <TextField
                  id="cedula"
                  label="Cédula / Identificación"
                  required
                  placeholder="Ej. 111820495"
                  disabled={isLoading}
                  error={errors.cedula?.message}
                  {...register("cedula")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Controller
                name="fechaNacimiento"
                control={control}
                render={({ field }) => (
                  <DateField
                    id="fechaNacimiento"
                    label="Fecha de Nacimiento"
                    required
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                    error={errors.fechaNacimiento?.message}
                  />
                )}
              />
              <Controller
                name="genero"
                control={control}
                render={({ field }) => (
                  <SelectField
                    id="genero"
                    label="Género"
                    required
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                    options={[
                      { value: "Masculino", label: "Masculino" },
                      { value: "Femenino", label: "Femenino" },
                      { value: "Otro", label: "Otro" },
                    ]}
                    error={errors.genero?.message}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <TextField
                id="telefono"
                label="Teléfono de Contacto"
                type="tel"
                placeholder="Ej. +57 300 123 4567"
                disabled={isLoading}
                error={errors.telefono?.message}
                {...register("telefono")}
              />
              <TextField
                id="especialidad"
                label="Especialidad / Modalidad"
                required
                placeholder="Ej. Lanzamientos / Pista"
                disabled={isLoading}
                error={errors.especialidad?.message}
                {...register("especialidad")}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <TextField
                id="correo"
                label="Correo Electrónico"
                required
                type="email"
                placeholder="Ej. entrenador@valle.co"
                disabled={isLoading}
                error={errors.correo?.message}
                {...register("correo")}
              />
            </div>

            <TextField
              id="password"
              label={
                isEditing
                  ? "Nueva Contraseña (dejar vacío para no cambiar)"
                  : "Contraseña de Ingreso"
              }
              required={!isEditing}
              type="password"
              placeholder="Crea tu contraseña"
              disabled={isLoading}
              error={errors.password?.message}
              {...register("password")}
            />
          </FormStep>

          {/* Navigation/Actions */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6">
            <div>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isLoading ? (
                <span className="animate-pulse">Guardando...</span>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Guardar Cambios" : "Guardar e Ingresar"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
