import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerCoachSchema,
  editCoachSchema,
} from "../../schemas/authSchemas";
import { saveProfessor } from "../../../../lib/supabase";

import { StepIndicator } from "./StepIndicator";
import { useMultiStep } from "./useMultiStep";
import { UnsavedChangesGuard } from "./UnsavedChangesGuard";
import {
  BasicDataStep,
  BASIC_DATA_FIELDS,
  ContactInfoStep,
  CONTACT_INFO_FIELDS,

} from "./athlete-register";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

const STEPS = [
  { label: "Datos Básicos", fields: BASIC_DATA_FIELDS },
  { label: "Contacto y Perfil", fields: [...CONTACT_INFO_FIELDS, "modalidad", "tallaChaqueta", "tallaCamibuso", "tallaPantalon", "tallaPantaloneta", "tallaTenisPresentacion"] },
];

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
    trigger,
    formState: { errors, isDirty },
  } = useForm<any>({
    resolver: zodResolver(
      isEditing ? editCoachSchema : registerCoachSchema,
    ),
    defaultValues: {
      nombre: "",
      tipoDocumento: "",
      cedula: "",
      genero: "Masculino",
      grupoSanguineo: "",
      fechaNacimiento: "",
      paisNacimiento: "",
      departamentoNacimiento: "",
      municipioNacimiento: "",
      grupoEtnico: "",
      nivelEducativo: "",
      eps: "",
      altura: "",
      peso: "",
      correo: "",
      paisResidencia: "",
      departamentoResidencia: "",
      municipioResidencia: "",
      barrio: "",
      direccion: "",
      estrato: "",
      telefonoFijo: "",
      telefono: "",
      discapacidad: "",
      usaSillaRuedas: "",
      usaSillaAtletica: "",
      club: "",
      fechaAfiliacion: "",
      liga: "",
      password: "",
      foto: "",
      tipoClase: "",
      claseDeportiva: "",
      especialidad: "",
    },
    mode: "onTouched",
  });

  const formValues = useWatch({ control });

  const validateCurrentStep = async () => {
    const fields = STEPS[stepper.currentStep]?.fields;
    if (!fields) return true;
    return trigger(fields);
  };

  const stepper = useMultiStep(STEPS.length, {
    onBeforeNext: validateCurrentStep,
  });

  const watchDiscapacidad = formValues.discapacidad;

  // Init / reset
  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        nombre: initialData.nombre || "",
        tipoDocumento: initialData.tipoDocumento || "",
        cedula: initialData.cedula || "",
        genero: initialData.genero || "Masculino",
        grupoSanguineo: initialData.grupoSanguineo || "",
        fechaNacimiento: initialData.fechaNacimiento || "",
        paisNacimiento: initialData.paisNacimiento || "",
        departamentoNacimiento: initialData.departamentoNacimiento || "",
        municipioNacimiento: initialData.municipioNacimiento || "",
        grupoEtnico: initialData.grupoEtnico || "",
        nivelEducativo: initialData.nivelEducativo || "",
        eps: initialData.eps || "",
        altura: initialData.altura || "",
        peso: initialData.peso || "",
        correo: initialData.correo || "",
        paisResidencia: initialData.paisResidencia || "",
        departamentoResidencia: initialData.departamentoResidencia || "",
        municipioResidencia: initialData.municipioResidencia || "",
        barrio: initialData.barrio || "",
        direccion: initialData.direccion || "",
        estrato: initialData.estrato || "",
        telefonoFijo: initialData.telefonoFijo || "",
        telefono: initialData.telefono || "",
        discapacidad: initialData.discapacidad || "",
        usaSillaRuedas: initialData.usaSillaRuedas || "",
        usaSillaAtletica: initialData.usaSillaAtletica || "",
        club: initialData.club || "",
        fechaAfiliacion: initialData.fechaAfiliacion || "",
        liga: initialData.liga || "",
        password: "",
        foto: initialData.foto || "",
        tipoClase: initialData.tipoClase || "",
        claseDeportiva: initialData.claseDeportiva || "",
        especialidad: initialData.especialidad || "",
      });
      setPhotoBase64(initialData.foto || undefined);
    }
    setGeneralError(null);
  }, [initialData, reset]);

  // Photo handlers
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

  // Submit
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
    <>
      <UnsavedChangesGuard isDirty={isDirty && !isLoading} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {generalError && (
          <div className="animate-fade-in rounded-2xl border border-red-200 bg-red-50 p-4 text-xs leading-relaxed font-semibold text-red-600">
            {generalError}
          </div>
        )}

        <StepIndicator currentStep={stepper.currentStep} steps={STEPS} />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left: Photo + Preview (Only visible in first step) */}
          <div className={`space-y-8 lg:col-span-4 ${stepper.currentStep === 0 ? "" : "hidden"}`}>
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
                      person
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-bold text-slate-900">
                    {formValues.nombre || "Nombre del Entrenador"}
                  </h4>
                  <p className="mt-0.5 truncate text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {formValues.modalidad || "Entrenador"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {formValues.modalidad && (
                      <span className="rounded-md border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 capitalize">
                        {formValues.modalidad}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Steps */}
          <div className={`space-y-6 ${stepper.currentStep === 0 ? "lg:col-span-8" : "lg:col-span-12"}`}>
            <div className={stepper.currentStep === 0 ? "" : "hidden"}>
              <BasicDataStep
                register={register}
                control={control}
                errors={errors}
                isLoading={isLoading}
              />
            </div>

            <div className={stepper.currentStep === 1 ? "" : "hidden"}>
              <ContactInfoStep
                register={register}
                control={control}
                setValue={setValue}
                errors={errors}
                isLoading={isLoading}
                isCoach={true}
                isEditing={isEditing}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <div>
                {!stepper.isFirst && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={stepper.prev}
                    disabled={isLoading}
                  >
                    <ChevronLeft data-icon="inline-start" />
                    Anterior
                  </Button>
                )}
                {onCancel && stepper.isFirst && (
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

              <div className="flex gap-3">
                {stepper.isLast ? (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    {isLoading ? (
                      <span className="animate-pulse">Guardando...</span>
                    ) : (
                      <>
                        <Save data-icon="inline-start" />
                        {isEditing
                          ? "Guardar Cambios"
                          : "Guardar Entrenador"}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => stepper.next()}
                    disabled={isLoading}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Siguiente
                    <ChevronRight data-icon="inline-end" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
