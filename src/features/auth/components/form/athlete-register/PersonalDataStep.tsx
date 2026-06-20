import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { TextField, SelectField, DateField } from "../../fields";
import { FormStep } from "../FormStep";

const CLUBS = [
  "Club Deportivo Imparables a la Meta",
  "Club Deportivo Minas del Paraatletismo",
  "Club Deportivo Discatle",
  "Club Deportivo de Paraatletismo PC Yumbo",
  "Club Deportivo Casin",
];

interface PersonalDataStepProps {
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: FieldErrors<any>;
  isLoading: boolean;
  isEditing: boolean;
}

function PersonalDataStep({
  register: reg,
  control,
  errors,
  isLoading,
  isEditing,
}: PersonalDataStepProps) {
  return (
    <FormStep title="Datos Personales">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <TextField
            id="nombre"
            label="Nombre Completo"
            required
            placeholder="Ej. Mauricio Valencia"
            disabled={isLoading}
            error={errors.nombre?.message as string}
            {...reg("nombre")}
          />
        </div>
        <div>
          <TextField
            id="cedula"
            label="Cédula / Identificación"
            required
            placeholder="Ej. 111820495"
            disabled={isLoading}
            error={errors.cedula?.message as string}
            {...reg("cedula")}
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
              error={errors.fechaNacimiento?.message as string}
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
              error={errors.genero?.message as string}
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
          error={errors.telefono?.message as string}
          {...reg("telefono")}
        />
        <TextField
          id="correo"
          label="Correo Electrónico"
          required
          type="email"
          placeholder="Ej. atleta@valle.co"
          disabled={isLoading}
          error={errors.correo?.message as string}
          {...reg("correo")}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
          error={errors.password?.message as string}
          {...reg("password")}
        />
        <Controller
          name="club"
          control={control}
          render={({ field }) => (
            <SelectField
              id="club"
              label="Club"
              required
              placeholder="Seleccione un club..."
              value={field.value}
              onValueChange={field.onChange}
              disabled={isLoading}
              options={CLUBS.map((club) => ({
                value: club,
                label: club,
              }))}
              error={errors.club?.message as string}
            />
          )}
        />
      </div>
    </FormStep>
  );
}

export { PersonalDataStep };
export const PERSONAL_DATA_FIELDS = [
  "nombre",
  "cedula",
  "fechaNacimiento",
  "genero",
  "telefono",
  "correo",
  "password",
  "club",
];
