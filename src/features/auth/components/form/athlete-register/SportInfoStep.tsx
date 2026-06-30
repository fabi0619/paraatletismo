import React, { useState } from "react";
import { useWatch } from "react-hook-form";
import type { UseFormRegister, Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { FormStep } from "../FormStep";
import type { RegisterAthleteInput } from "../../../schemas/authSchemas";
import { 
  LIGAS, 
  CLUBS, 
  MODALIDADES, 
  CLASES_PISTA, 
  CLASES_CAMPO, 
  PRUEBAS_PISTA, 
  PRUEBAS_CAMPO, 
  TALLAS_US, 
  TALLAS_ROPA 
} from "../../../../../lib/formLists";
import { Button } from "@/components/ui/button";

export const SPORT_INFO_FIELDS = [
  "club",
  "fechaAfiliacion",
  "liga",
  "certificadoAfiliacion",
  "modalidad",
  "claseDeportiva",
  "pruebasPista",
  "pruebasCampo",
  "tallaSpikeVelocidad",
  "tallaSpikeSemifondo",
  "tallaSpikeFondo",
  "tallaSpikeBala",
  "tallaSpikeJabalina",
  "tallaTenisPresentacion",
  "tallaChaqueta",
  "tallaPantalon",
  "tallaCamibuso",
  "tallaCamisilla",
  "tallaLicraMedia",
  "tallaLicraLarga",
] as const;

interface SportInfoStepProps {
  register: UseFormRegister<any>;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  errors: any;
  isLoading: boolean;
  isEditing: boolean;
  isCoach?: boolean;
}

export const SportInfoStep: React.FC<SportInfoStepProps> = ({ register, control, setValue, errors, isLoading, isCoach = false }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const watchCertificado = useWatch({ control, name: "certificadoAfiliacion" });
  
  // Watch modality to dynamically show classes, events, and sizing
  const watchModalidad = useWatch({ control, name: "modalidad" });
  
  const watchedPruebasPista = useWatch({ control, name: "pruebasPista" }) || [];
  const watchedPruebasCampo = useWatch({ control, name: "pruebasCampo" }) || [];
  
  const isPista = watchModalidad === "Pista" || watchModalidad === "Pista y Campo";
  const isCampo = watchModalidad === "Campo" || watchModalidad === "Pista y Campo";

  const needsSpikeVelocidad = watchedPruebasPista.some((p: string) => ["100m", "200m", "400m", "Relevos"].includes(p));
  const needsSpikeSemifondo = watchedPruebasPista.some((p: string) => ["800m", "1500m"].includes(p));
  const needsSpikeFondo = watchedPruebasPista.some((p: string) => ["5000m", "10000m"].includes(p));

  const needsSpikeBala = watchedPruebasCampo.includes("Lanzamiento de Bala");
  const needsSpikeJabalina = watchedPruebasCampo.includes("Lanzamiento de Jabalina");
  const needsSpikeDisco = watchedPruebasCampo.includes("Lanzamiento de Disco");
  const needsSpikeClava = watchedPruebasCampo.includes("Lanzamiento de Clava");
  const needsSpikeSaltoLongitud = watchedPruebasCampo.includes("Salto de Longitud");
  const needsSpikeSaltoAltura = watchedPruebasCampo.includes("Salto de Altura");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("El certificado debe ser un archivo PDF.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo no debe superar los 5MB.");
        return;
      }
      setFileName(file.name);
      setValue("certificadoAfiliacion", file, { shouldValidate: true });
    }
  };

  return (
    <FormStep title="Información Deportiva" icon="sports">
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* --- DATOS DE AFILIACIÓN --- */}
        {!isCoach && (
          <>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Club al que está afiliado</label>
              <select
                {...register("club")}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
              >
                <option value="">Seleccione un club...</option>
                {CLUBS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.club && <p className="text-xs text-red-500">{errors.club.message as string}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Fecha de Afiliación</label>
              <input
                type="date"
                {...register("fechaAfiliacion")}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
              />
              {errors.fechaAfiliacion && <p className="text-xs text-red-500">{errors.fechaAfiliacion.message as string}</p>}
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Liga</label>
              <select
                {...register("liga")}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
              >
                <option value="">Seleccionar liga...</option>
                {LIGAS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              {errors.liga && <p className="text-xs text-red-500">{errors.liga.message as string}</p>}
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Certificado de Afiliación al Club (PDF)</label>
              <div className="mt-1 flex items-center gap-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6">
                <div className="flex-1">
                  {fileName || typeof watchCertificado === 'string' ? (
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <span className="material-icons-round text-red-500">picture_as_pdf</span>
                      <span className="truncate">{fileName || "Certificado_Subido.pdf"}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500">
                      Sube el documento oficial en formato PDF (Max 5MB)
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  <input
                    type="file"
                    id="certificado-upload"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("certificado-upload")?.click()}
                    disabled={isLoading}
                  >
                    <span className="material-icons-round mr-2 text-sm">upload_file</span>
                    {fileName || watchCertificado ? "Cambiar Archivo" : "Subir PDF"}
                  </Button>
                </div>
              </div>
              {errors.certificadoAfiliacion && <p className="text-xs text-red-500">{errors.certificadoAfiliacion.message as string}</p>}
            </div>
          </>
        )}

        {/* --- MÓDULO DE PRUEBAS Y CLASES --- */}
        <div className="space-y-1 md:col-span-2 mt-4 pt-6 border-t border-slate-100">
          <h4 className="text-sm font-black text-slate-800 mb-4">Módulo de Pruebas y Clases</h4>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Modalidad</label>
          <select
            {...register("modalidad")}
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
            onChange={(e) => {
              register("modalidad").onChange(e);
              // Al cambiar modalidad, reiniciamos la clase deportiva para evitar incongruencias
              setValue("claseDeportiva", "");
            }}
          >
            <option value="">Seleccione Modalidad...</option>
            {MODALIDADES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {errors.modalidad && <p className="text-xs text-red-500">{errors.modalidad.message}</p>}
        </div>

        {!isCoach && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Clase Deportiva</label>
            <select
              {...register("claseDeportiva")}
              disabled={isLoading || !watchModalidad}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none"
            >
              <option value="">Seleccione Clase...</option>
              {isPista && !isCampo && CLASES_PISTA.map(c => <option key={c} value={c}>{c}</option>)}
              {isCampo && !isPista && CLASES_CAMPO.map(c => <option key={c} value={c}>{c}</option>)}
              {watchModalidad === "Pista y Campo" && (
                <>
                  <optgroup label="Clases de Pista">
                    {CLASES_PISTA.map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                  <optgroup label="Clases de Campo">
                    {CLASES_CAMPO.map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                </>
              )}
            </select>
            {errors.claseDeportiva && <p className="text-xs text-red-500">{errors.claseDeportiva.message as string}</p>}
          </div>
        )}

        {!isCoach && isPista && (
          <div className="space-y-3 md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase block mb-2">Pruebas de Pista (Seleccione Participación)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {PRUEBAS_PISTA.map(prueba => (
                <div key={prueba} className="flex flex-col gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-sm font-medium text-slate-700 text-center">{prueba}</span>
                  <select
                    className="w-full text-xs rounded-md border border-slate-200 py-1.5 px-2 bg-slate-50 focus:outline-none focus:border-red-500 font-medium text-slate-700"
                    value={watchedPruebasPista.includes(prueba) ? prueba : ""}
                    disabled={isLoading}
                    onChange={(e) => {
                      const isSelected = e.target.value === prueba;
                      if (isSelected) {
                        setValue("pruebasPista", [...watchedPruebasPista, prueba], { shouldValidate: true });
                      } else {
                        setValue("pruebasPista", watchedPruebasPista.filter((p: string) => p !== prueba), { shouldValidate: true });
                      }
                    }}
                  >
                    <option value="">✗ No</option>
                    <option value={prueba}>✓ Sí</option>
                  </select>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 italic mt-2">Nota: Al marcar una con ✓ (Sí), el sistema asume que no participa en las demás (X).</p>
          </div>
        )}

        {!isCoach && isCampo && (
          <div className="space-y-3 md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase block mb-2">Pruebas de Campo (Seleccione Participación)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {PRUEBAS_CAMPO.map(prueba => (
                <div key={prueba} className="flex flex-col gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-sm font-medium text-slate-700 text-center">{prueba}</span>
                  <select
                    className="w-full text-xs rounded-md border border-slate-200 py-1.5 px-2 bg-slate-50 focus:outline-none focus:border-red-500 font-medium text-slate-700"
                    value={watchedPruebasCampo.includes(prueba) ? prueba : ""}
                    disabled={isLoading}
                    onChange={(e) => {
                      const isSelected = e.target.value === prueba;
                      if (isSelected) {
                        setValue("pruebasCampo", [...watchedPruebasCampo, prueba], { shouldValidate: true });
                      } else {
                        setValue("pruebasCampo", watchedPruebasCampo.filter((p: string) => p !== prueba), { shouldValidate: true });
                      }
                    }}
                  >
                    <option value="">✗ No</option>
                    <option value={prueba}>✓ Sí</option>
                  </select>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 italic mt-2">Nota: Al marcar una con ✓ (Sí), el sistema asume que no participa en las demás (X).</p>
          </div>
        )}
        {!isCoach && (
          <>
            {/* --- TALLA CALZADO --- */}
            <div className="space-y-1 md:col-span-2 mt-4 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-black text-slate-800 mb-4">Talla Calzado (Competencia y Presentación) - Escala US</h4>
            </div>

            {needsSpikeVelocidad && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Talla Spike Velocidad</label>
                <select {...register("tallaSpikeVelocidad")} disabled={isLoading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none">
                  <option value="">Seleccione talla...</option>
                  {TALLAS_US.map(t => <option key={t} value={t}>{t} US</option>)}
                </select>
              </div>
            )}
            
            {needsSpikeSemifondo && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Talla Spike Semifondo</label>
                <select {...register("tallaSpikeSemifondo")} disabled={isLoading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none">
                  <option value="">Seleccione talla...</option>
                  {TALLAS_US.map(t => <option key={t} value={t}>{t} US</option>)}
                </select>
              </div>
            )}
        
        {needsSpikeFondo && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Talla Spike Fondo</label>
            <select {...register("tallaSpikeFondo")} disabled={isLoading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none">
              <option value="">Seleccione talla...</option>
              {TALLAS_US.map(t => <option key={t} value={t}>{t} US</option>)}
            </select>
          </div>
        )}

        {needsSpikeBala && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Talla Spike Lanzamiento de Bala</label>
            <select {...register("tallaSpikeBala")} disabled={isLoading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none">
              <option value="">Seleccione talla...</option>
              {TALLAS_US.map(t => <option key={t} value={t}>{t} US</option>)}
            </select>
          </div>
        )}
        
        {needsSpikeJabalina && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Talla Spike Jabalina</label>
            <select {...register("tallaSpikeJabalina")} disabled={isLoading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none">
              <option value="">Seleccione talla...</option>
              {TALLAS_US.map(t => <option key={t} value={t}>{t} US</option>)}
            </select>
          </div>
        )}

        {needsSpikeDisco && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Talla Spike Lanzamiento de Disco</label>
            <select {...register("tallaSpikeDisco")} disabled={isLoading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none">
              <option value="">Seleccione talla...</option>
              {TALLAS_US.map(t => <option key={t} value={t}>{t} US</option>)}
            </select>
          </div>
        )}

        {needsSpikeClava && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Talla Spike Lanzamiento de Clava</label>
            <select {...register("tallaSpikeClava")} disabled={isLoading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none">
              <option value="">Seleccione talla...</option>
              {TALLAS_US.map(t => <option key={t} value={t}>{t} US</option>)}
            </select>
          </div>
        )}

        {needsSpikeSaltoLongitud && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Talla Spike Salto de Longitud</label>
            <select {...register("tallaSpikeSaltoLongitud")} disabled={isLoading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none">
              <option value="">Seleccione talla...</option>
              {TALLAS_US.map(t => <option key={t} value={t}>{t} US</option>)}
            </select>
          </div>
        )}

        {needsSpikeSaltoAltura && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase">Talla Spike Salto de Altura</label>
            <select {...register("tallaSpikeSaltoAltura")} disabled={isLoading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none">
              <option value="">Seleccione talla...</option>
              {TALLAS_US.map(t => <option key={t} value={t}>{t} US</option>)}
            </select>
          </div>
        )}
        </>
        )}

        {!isCoach && (
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 uppercase">Talla Tenis de Presentación</label>
            <select {...register("tallaTenisPresentacion")} disabled={isLoading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none">
              <option value="">Seleccione talla...</option>
              {TALLAS_US.map(t => <option key={t} value={t}>{t} US</option>)}
            </select>
            {errors.tallaTenisPresentacion && <p className="text-xs text-red-500">{errors.tallaTenisPresentacion.message as string}</p>}
          </div>
        )}

        {!isCoach && (
          <>
            {/* --- TALLA UNIFORMES --- */}
            <div className="space-y-1 md:col-span-2 mt-4 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-black text-slate-800 mb-4">Talla Uniformes (Competencia y Presentación)</h4>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Talla Chaqueta</label>
              <select {...register("tallaChaqueta")} disabled={isLoading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none">
                <option value="">Seleccione talla...</option>
                {TALLAS_ROPA.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.tallaChaqueta && <p className="text-xs text-red-500">{errors.tallaChaqueta.message as string}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Talla Pantalón</label>
              <select {...register("tallaPantalon")} disabled={isLoading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none">
                <option value="">Seleccione talla...</option>
                {TALLAS_ROPA.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.tallaPantalon && <p className="text-xs text-red-500">{errors.tallaPantalon.message as string}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Talla Camibuso</label>
              <select {...register("tallaCamibuso")} disabled={isLoading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none">
                <option value="">Seleccione talla...</option>
                {TALLAS_ROPA.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.tallaCamibuso && <p className="text-xs text-red-500">{errors.tallaCamibuso.message as string}</p>}
            </div>
          </>
        )}

        {!isCoach && (
          <>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Talla Camisilla Competencia</label>
              <select {...register("tallaCamisilla")} disabled={isLoading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none">
                <option value="">Seleccione talla...</option>
                {TALLAS_ROPA.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.tallaCamisilla && <p className="text-xs text-red-500">{errors.tallaCamisilla.message as string}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Pant. Licrado Media Caña</label>
              <select {...register("tallaLicraMedia")} disabled={isLoading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none">
                <option value="">Seleccione talla...</option>
                {TALLAS_ROPA.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.tallaLicraMedia && <p className="text-xs text-red-500">{errors.tallaLicraMedia.message as string}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Pant. Licrado Largo</label>
              <select {...register("tallaLicraLarga")} disabled={isLoading} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors focus:border-red-500 focus:outline-none">
                <option value="">Seleccione talla...</option>
                {TALLAS_ROPA.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.tallaLicraLarga && <p className="text-xs text-red-500">{errors.tallaLicraLarga.message as string}</p>}
            </div>
          </>
        )}



      </div>
    </FormStep>
  );
};
