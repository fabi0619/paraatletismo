import React from "react";
import type { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import type { RegisterAthleteInput } from "../../../schemas/authSchemas";
import { FormStep } from "../FormStep";

interface GuardianInfoStepProps {
  register: UseFormRegister<RegisterAthleteInput>;
  control: Control<RegisterAthleteInput>;
  errors: FieldErrors<RegisterAthleteInput>;
  isLoading: boolean;
}

export const GUARDIAN_INFO_FIELDS = [
  "nombreAcudiente",
  "correoAcudiente",
  "departamentoAcudiente",
  "municipioAcudiente",
  "barrioAcudiente",
  "direccionAcudiente",
  "telefonoAcudiente",
] as const;

export const GuardianInfoStep: React.FC<GuardianInfoStepProps> = ({
  register,
  errors,
  isLoading,
}) => {
  return (
    <FormStep title="Información Acudiente" icon="family_restroom">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-700 uppercase">Nombre y Apellido del Acudiente</label>
          <div className="relative">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
            <input
              {...register("nombreAcudiente")}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
              placeholder="Nombre completo"
            />
          </div>
          {errors.nombreAcudiente && <p className="text-xs text-red-500">{errors.nombreAcudiente.message as string}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Correo Electrónico</label>
          <div className="relative">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">email</span>
            <input
              {...register("correoAcudiente")}
              type="email"
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
              placeholder="correo@ejemplo.com"
            />
          </div>
          {errors.correoAcudiente && <p className="text-xs text-red-500">{errors.correoAcudiente.message as string}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Número de Celular</label>
          <div className="relative">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">phone_iphone</span>
            <input
              {...register("telefonoAcudiente")}
              type="tel"
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
              placeholder="300 000 0000"
            />
          </div>
          {errors.telefonoAcudiente && <p className="text-xs text-red-500">{errors.telefonoAcudiente.message as string}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Departamento</label>
          <div className="relative">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">map</span>
            <input
              {...register("departamentoAcudiente")}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
              placeholder="Ej. Valle del Cauca"
            />
          </div>
          {errors.departamentoAcudiente && <p className="text-xs text-red-500">{errors.departamentoAcudiente.message as string}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Municipio</label>
          <div className="relative">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">location_city</span>
            <input
              {...register("municipioAcudiente")}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
              placeholder="Ej. Cali"
            />
          </div>
          {errors.municipioAcudiente && <p className="text-xs text-red-500">{errors.municipioAcudiente.message as string}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Barrio</label>
          <div className="relative">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">holiday_village</span>
            <input
              {...register("barrioAcudiente")}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
              placeholder="Ej. San Fernando"
            />
          </div>
          {errors.barrioAcudiente && <p className="text-xs text-red-500">{errors.barrioAcudiente.message as string}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Dirección</label>
          <div className="relative">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">home</span>
            <input
              {...register("direccionAcudiente")}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
              placeholder="Ej. Cra 34 # 5-12"
            />
          </div>
          {errors.direccionAcudiente && <p className="text-xs text-red-500">{errors.direccionAcudiente.message as string}</p>}
        </div>
      </div>
    </FormStep>
  );
};
