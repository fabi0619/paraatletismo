import React from "react";
import { useWatch } from "react-hook-form";
import type { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { FormStep } from "../FormStep";
import type { RegisterAthleteInput } from "../../../schemas/authSchemas";
import { 
  TIPOS_DOCUMENTO, 
  GRUPOS_SANGUINEOS, 
  PAISES, 
  DEPARTAMENTOS_COLOMBIA, 
  MUNICIPIOS_VALLE, 
  GRUPOS_ETNICOS, 
  NIVELES_EDUCATIVOS, 
  EPS_COLOMBIA 
} from "../../../../../lib/formLists";

export const BASIC_DATA_FIELDS = [
  "nombre",
  "tipoDocumento",
  "cedula",
  "genero",
  "grupoSanguineo",
  "fechaNacimiento",
  "paisNacimiento",
  "departamentoNacimiento",
  "municipioNacimiento",
  "grupoEtnico",
  "nivelEducativo",
  "eps",
  "altura",
  "peso"
] as const;

interface BasicDataStepProps {
  register: UseFormRegister<RegisterAthleteInput>;
  control: Control<RegisterAthleteInput>;
  errors: FieldErrors<RegisterAthleteInput>;
  isLoading: boolean;
}

export const BasicDataStep: React.FC<BasicDataStepProps> = ({ register, control, errors, isLoading }) => {
  const watchPaisNacimiento = useWatch({ control, name: "paisNacimiento" });
  const watchDepartamentoNacimiento = useWatch({ control, name: "departamentoNacimiento" });

  return (
    <FormStep title="Datos Básicos" icon="person">
      <div className="grid gap-6 md:grid-cols-2">
        
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-700 uppercase">Nombres y Apellidos</label>
          <input
            type="text"
            {...register("nombre")}
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10"
            placeholder="Ej: Juan Pérez"
          />
          {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Tipo Doc.</label>
            <select
              {...register("tipoDocumento")}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
            >
              <option value="">Seleccionar...</option>
              {TIPOS_DOCUMENTO.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.tipoDocumento && <p className="text-xs text-red-500">{errors.tipoDocumento.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Número Documento</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              {...register("cedula")}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
                register("cedula").onChange(e);
              }}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
            />
            {errors.cedula && <p className="text-xs text-red-500">{errors.cedula.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Género</label>
            <select
              {...register("genero")}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
            >
              <option value="">Seleccionar...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
            {errors.genero && <p className="text-xs text-red-500">{errors.genero.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Grupo Sanguíneo</label>
            <select
              {...register("grupoSanguineo")}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
            >
              <option value="">RH...</option>
              {GRUPOS_SANGUINEOS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            {errors.grupoSanguineo && <p className="text-xs text-red-500">{errors.grupoSanguineo.message}</p>}
          </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Fecha de Nacimiento</label>
          <input
            type="date"
            {...register("fechaNacimiento")}
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
          />
          {errors.fechaNacimiento && <p className="text-xs text-red-500">{errors.fechaNacimiento.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">País de Nacimiento</label>
          <select
            {...register("paisNacimiento")}
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
          >
            <option value="">Seleccionar...</option>
            {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {errors.paisNacimiento && <p className="text-xs text-red-500">{errors.paisNacimiento.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Depto. de Nacimiento</label>
          <select
            {...register("departamentoNacimiento")}
            disabled={isLoading || !watchPaisNacimiento}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
          >
            <option value="">Seleccionar...</option>
            {watchPaisNacimiento === "Colombia" ? (
              DEPARTAMENTOS_COLOMBIA.map(d => <option key={d} value={d}>{d}</option>)
            ) : (
              <option value="N/A">No Aplica / Extranjero</option>
            )}
          </select>
          {errors.departamentoNacimiento && <p className="text-xs text-red-500">{errors.departamentoNacimiento.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Municipio Nacimiento</label>
          <select
            {...register("municipioNacimiento")}
            disabled={isLoading || !watchDepartamentoNacimiento}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
          >
            <option value="">Seleccionar...</option>
            {watchDepartamentoNacimiento === "Valle del Cauca" ? (
              MUNICIPIOS_VALLE.map(m => <option key={m} value={m}>{m}</option>)
            ) : (
              <option value="Capital/Principal">Capital/Principal (Genérico)</option>
            )}
          </select>
          {errors.municipioNacimiento && <p className="text-xs text-red-500">{errors.municipioNacimiento.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Grupo Étnico</label>
          <select
            {...register("grupoEtnico")}
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
          >
            <option value="">Seleccionar...</option>
            {GRUPOS_ETNICOS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          {errors.grupoEtnico && <p className="text-xs text-red-500">{errors.grupoEtnico.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Nivel Educativo</label>
          <select
            {...register("nivelEducativo")}
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
          >
            <option value="">Seleccionar...</option>
            {NIVELES_EDUCATIVOS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          {errors.nivelEducativo && <p className="text-xs text-red-500">{errors.nivelEducativo.message}</p>}
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-700 uppercase">EPS / Salud</label>
          <select
            {...register("eps")}
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
          >
            <option value="">Seleccionar...</option>
            {EPS_COLOMBIA.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          {errors.eps && <p className="text-xs text-red-500">{errors.eps.message}</p>}
        </div>

        <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Altura (cm)</label>
            <select
              {...register("altura")}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
            >
              <option value="">...</option>
              {Array.from({ length: 131 }, (_, i) => 100 + i).map(cm => (
                <option key={cm} value={`${cm} cm`}>{cm} cm</option>
              ))}
            </select>
            {errors.altura && <p className="text-xs text-red-500">{errors.altura.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Peso (kg)</label>
            <select
              {...register("peso")}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
            >
              <option value="">...</option>
              {Array.from({ length: 171 }, (_, i) => 30 + i).map(kg => (
                <option key={kg} value={`${kg} kg`}>{kg} kg</option>
              ))}
            </select>
            {errors.peso && <p className="text-xs text-red-500">{errors.peso.message}</p>}
          </div>

      </div>
    </FormStep>
  );
};
