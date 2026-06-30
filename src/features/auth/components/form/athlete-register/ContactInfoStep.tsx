import React from "react";
import { useWatch } from "react-hook-form";
import type { UseFormRegister, Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { FormStep } from "../FormStep";
import type { RegisterAthleteInput } from "../../../schemas/authSchemas";
import { 
  PAISES, 
  DEPARTAMENTOS_COLOMBIA, 
  MUNICIPIOS_VALLE,
  MODALIDADES,
  TALLAS_ROPA,
  TALLAS_US
} from "../../../../../lib/formLists";
import { DISCAPACIDADES } from "../../../../../lib/classes";

export const CONTACT_INFO_FIELDS = [
  "correo",
  "password",
  "paisResidencia",
  "departamentoResidencia",
  "municipioResidencia",
  "barrio",
  "direccion",
  "estrato",
  "telefonoFijo",
  "telefono",
  "discapacidad",
  "usaSillaRuedas",
  "usaSillaAtletica"
] as const;

interface ContactInfoStepProps {
  register: UseFormRegister<any>;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  errors: any;
  isLoading: boolean;
  isCoach?: boolean;
  isEditing?: boolean;
}

export const ContactInfoStep: React.FC<ContactInfoStepProps> = ({ register, control, setValue, errors, isLoading, isCoach, isEditing }) => {
  const watchPaisResidencia = useWatch({ control, name: "paisResidencia" });
  const watchDepartamentoResidencia = useWatch({ control, name: "departamentoResidencia" });
  const watchEstrato = useWatch({ control, name: "estrato" });

  return (
    <FormStep title="Información de Contacto" icon="contact_phone">
      <div className="grid gap-6 md:grid-cols-2">
        
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Correo Electrónico</label>
          <input
            type="email"
            {...register("correo")}
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10"
            placeholder="ejemplo@correo.com"
          />
          {errors.correo && <p className="text-xs text-red-500">{errors.correo.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">
            {isEditing ? "Nueva Contraseña (Opcional)" : "Contraseña de Acceso"}
          </label>
          <input
            type="password"
            {...register("password")}
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10"
            placeholder="Mínimo 6 caracteres"
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message as string}</p>}
        </div>

        <div className="grid gap-4 grid-cols-2 md:col-span-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Celular <span className="text-red-500">*</span></label>
            <input
              type="tel"
              {...register("telefono")}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
            />
            {errors.telefono && <p className="text-xs text-red-500">{errors.telefono.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Teléfono Fijo</label>
            <input
              type="tel"
              {...register("telefonoFijo")}
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
              placeholder="Opcional"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">País de Residencia</label>
          <select
            {...register("paisResidencia")}
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
          >
            <option value="">Seleccionar...</option>
            {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {errors.paisResidencia && <p className="text-xs text-red-500">{errors.paisResidencia.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Depto. de Residencia</label>
          <select
            {...register("departamentoResidencia")}
            disabled={isLoading || !watchPaisResidencia}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
          >
            <option value="">Seleccionar...</option>
            {watchPaisResidencia === "Colombia" ? (
              DEPARTAMENTOS_COLOMBIA.map(d => <option key={d} value={d}>{d}</option>)
            ) : (
              <option value="N/A">No Aplica / Extranjero</option>
            )}
          </select>
          {errors.departamentoResidencia && <p className="text-xs text-red-500">{errors.departamentoResidencia.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Municipio Residencia</label>
          <select
            {...register("municipioResidencia")}
            disabled={isLoading || !watchDepartamentoResidencia}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
          >
            <option value="">Seleccionar...</option>
            {watchDepartamentoResidencia === "Valle del Cauca" ? (
              MUNICIPIOS_VALLE.map(m => <option key={m} value={m}>{m}</option>)
            ) : (
              <option value="Capital/Principal">Capital/Principal (Genérico)</option>
            )}
          </select>
          {errors.municipioResidencia && <p className="text-xs text-red-500">{errors.municipioResidencia.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Barrio</label>
          <input
            type="text"
            {...register("barrio")}
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
          />
          {errors.barrio && <p className="text-xs text-red-500">{errors.barrio.message}</p>}
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-700 uppercase">Dirección de Residencia</label>
          <input
            type="text"
            {...register("direccion")}
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
            placeholder="Ej: Calle 123 # 45 - 67"
          />
          {errors.direccion && <p className="text-xs text-red-500">{errors.direccion.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-slate-700 uppercase">Estrato Socioeconómico</label>
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5, 6].map(num => {
              const isSelected = watchEstrato === num.toString();
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setValue("estrato", num.toString(), { shouldValidate: true })}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    isSelected 
                      ? "border-red-500 bg-red-500 text-white shadow-md scale-110"
                      : "border-slate-200 bg-white text-slate-600 hover:border-red-300 hover:bg-red-50"
                  }`}
                >
                  <span className="font-bold">{num}</span>
                </button>
              );
            })}
          </div>
          {errors.estrato && <p className="text-xs text-red-500">{errors.estrato.message}</p>}
        </div>

        {/* Sección de Discapacidad / Clasificación Básica (Sólo Atletas) */}
        {!isCoach && (
          <>
            <div className="space-y-1 md:col-span-2 mt-4 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-black text-slate-800 mb-4">Condición / Discapacidad</h4>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Discapacidad</label>
              <select
                {...register("discapacidad")}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
              >
                <option value="">Seleccionar...</option>
                {Object.entries(DISCAPACIDADES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.nombre.replace("Discapacidad ", "")}
                  </option>
                ))}
                <option value="Guia">Guía (Atleta de apoyo)</option>
                <option value="Auxiliar">Auxiliar / Otro</option>
              </select>
              {errors.discapacidad && <p className="text-xs text-red-500">{errors.discapacidad.message}</p>}
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase leading-tight">Usuario Silla de Ruedas?</label>
                <select
                  {...register("usaSillaRuedas")}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
                >
                  <option value="">...</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
                {errors.usaSillaRuedas && <p className="text-xs text-red-500">{errors.usaSillaRuedas.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase leading-tight">Silla Atlética / Banco?</label>
                <select
                  {...register("usaSillaAtletica")}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
                >
                  <option value="">...</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
                {errors.usaSillaAtletica && <p className="text-xs text-red-500">{errors.usaSillaAtletica.message}</p>}
              </div>
            </div>
          </>
        )}

        {isCoach && (
          <>
            <div className="space-y-1 md:col-span-2 mt-4 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-black text-slate-800 mb-4">Perfil del Entrenador</h4>
            </div>
            
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Modalidad en la que es Experto</label>
              <select
                {...register("modalidad")}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
              >
                <option value="">Seleccione Modalidad...</option>
                {MODALIDADES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.modalidad && <p className="text-xs text-red-500">{errors.modalidad.message}</p>}
            </div>

            <div className="space-y-1 md:col-span-2 mt-4 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-black text-slate-800 mb-4">Tallas de Dotación</h4>
            </div>

            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 md:col-span-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Chaqueta</label>
                <select
                  {...register("tallaChaqueta")}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
                >
                  <option value="">Seleccionar...</option>
                  {TALLAS_ROPA.map((t: string) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.tallaChaqueta && <p className="text-xs text-red-500">{errors.tallaChaqueta.message as string}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Camibuso</label>
                <select
                  {...register("tallaCamibuso")}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
                >
                  <option value="">Seleccionar...</option>
                  {TALLAS_ROPA.map((t: string) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.tallaCamibuso && <p className="text-xs text-red-500">{errors.tallaCamibuso.message as string}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Sudadera</label>
                <select
                  {...register("tallaPantalon")}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
                >
                  <option value="">Seleccionar...</option>
                  {TALLAS_ROPA.map((t: string) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.tallaPantalon && <p className="text-xs text-red-500">{errors.tallaPantalon.message as string}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Pantaloneta</label>
                <select
                  {...register("tallaPantaloneta")}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
                >
                  <option value="">Seleccionar...</option>
                  {TALLAS_ROPA.map((t: string) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.tallaPantaloneta && <p className="text-xs text-red-500">{errors.tallaPantaloneta.message as string}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Calzado Tenis</label>
                <select
                  {...register("tallaTenisPresentacion")}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
                >
                  <option value="">Seleccionar...</option>
                  {TALLAS_US.map((t: string) => <option key={t} value={t}>{t} US</option>)}
                </select>
                {errors.tallaTenisPresentacion && <p className="text-xs text-red-500">{errors.tallaTenisPresentacion.message as string}</p>}
              </div>
            </div>


          </>
        )}
      </div>
    </FormStep>
  );
};
