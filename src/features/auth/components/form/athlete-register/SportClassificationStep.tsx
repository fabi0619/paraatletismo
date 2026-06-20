import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { CLASES_DEPORTIVAS, DISCAPACIDADES } from "../../../../../lib/classes";
import { SelectField } from "../../fields";
import { FormStep } from "../FormStep";

interface SportClassificationStepProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  isLoading: boolean;
  watchDiscapacidad: string;
  watchTipoClase: string;
  availableClasses: typeof CLASES_DEPORTIVAS;
  selectedClassInfo: string | null;
}

function SportClassificationStep({
  control,
  errors,
  isLoading,
  watchDiscapacidad,
  watchTipoClase,
  availableClasses,
  selectedClassInfo,
}: SportClassificationStepProps) {
  return (
    <FormStep title="Clasificación Deportiva">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Controller
          name="discapacidad"
          control={control}
          render={({ field }) => (
            <SelectField
              id="discapacidad"
              label="Discapacidad"
              required
              placeholder="Seleccione..."
              value={field.value}
              onValueChange={field.onChange}
              disabled={isLoading}
              options={Object.entries(DISCAPACIDADES).map(
                ([key, discObj]) => ({
                  value: key,
                  label: discObj.nombre,
                }),
              )}
              error={errors.discapacidad?.message as string}
            />
          )}
        />
        <Controller
          name="tipoClase"
          control={control}
          render={({ field }) => (
            <SelectField
              id="tipoClase"
              label="Modalidad"
              required
              placeholder="Primero elija discapacidad..."
              value={field.value}
              onValueChange={field.onChange}
              disabled={!watchDiscapacidad || isLoading}
              options={[
                { value: "pista", label: "Pista (T)" },
                { value: "campo", label: "Campo (F)" },
              ]}
              error={errors.tipoClase?.message as string}
            />
          )}
        />
        <Controller
          name="claseDeportiva"
          control={control}
          render={({ field }) => (
            <SelectField
              id="claseDeportiva"
              label="Clase Deportiva"
              required
              placeholder="Primero elija modalidad..."
              value={field.value}
              onValueChange={field.onChange}
              disabled={!watchTipoClase || isLoading}
              options={availableClasses.map((item) => ({
                value: item.clase,
                label: item.clase,
              }))}
              error={errors.claseDeportiva?.message as string}
            />
          )}
        />
      </div>

      {selectedClassInfo && (
        <div className="animate-fade-in flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-xs leading-relaxed font-medium text-slate-700">
          <span className="material-icons-round shrink-0 text-lg text-red-500">
            info
          </span>
          <p>{selectedClassInfo}</p>
        </div>
      )}
    </FormStep>
  );
}

export { SportClassificationStep };
export const SPORT_CLASSIFICATION_FIELDS = [
  "discapacidad",
  "tipoClase",
  "claseDeportiva",
];
