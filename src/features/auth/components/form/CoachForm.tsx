import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerCoachSchema,
  type RegisterCoachInput,
} from "../../schemas/authSchemas";
import { registrarProfesor, iniciarSesion } from "../../../../lib/supabase";
import { Button } from "@/components/ui/button";
import { TextField, DateField } from "../fields";
import { FormStep } from "./FormStep";

interface CoachFormProps {
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  setGeneralError: (val: string | null) => void;
}

function CoachForm({ isLoading, setIsLoading, setGeneralError }: CoachFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterCoachInput>({
    resolver: zodResolver(registerCoachSchema),
  });

  const onSubmit = async (data: RegisterCoachInput) => {
    setIsLoading(true);
    setGeneralError(null);
    try {
      const res = await registrarProfesor({
        nombre: data.nombre,
        cedula: data.cedula,
        fechaNacimiento: data.fechaNacimiento,
        especialidad: data.especialidad,
        correo: data.correo,
        password: data.password,
      });

      if (res && res.error) {
        setGeneralError(res.error);
        setIsLoading(false);
        return;
      }

      const sesion = await iniciarSesion(data.correo, data.password, "profesor");
      if (sesion) {
        window.location.href = "/";
      }
    } catch (error: any) {
      setGeneralError(error.message || "Error al registrar el profesor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-lg mx-auto">
      <FormStep title="Datos del Entrenador">
        <div className="flex flex-col gap-6">
          <TextField
            id="nombre"
            label="Nombre Completo"
            placeholder="Ej. Carlos Arias"
            disabled={isLoading}
            error={errors.nombre?.message}
            {...register("nombre")}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TextField
              id="cedula"
              label="Cédula"
              placeholder="Ej. 111820495"
              disabled={isLoading}
              error={errors.cedula?.message}
              {...register("cedula")}
            />
            <Controller
              name="fechaNacimiento"
              control={control}
              render={({ field }) => (
                <DateField
                  id="fechaNacimiento"
                  label="Fecha de Nacimiento"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                  error={errors.fechaNacimiento?.message}
                />
              )}
            />
          </div>

          <TextField
            id="especialidad"
            label="Modalidad / Especialidad"
            placeholder="Ej. Lanzamientos / Pista"
            disabled={isLoading}
            error={errors.especialidad?.message}
            {...register("especialidad")}
          />

          <TextField
            id="correo"
            label="Correo Electrónico"
            type="email"
            placeholder="Ej. entrenador@valle.co"
            disabled={isLoading}
            error={errors.correo?.message}
            {...register("correo")}
          />

          <TextField
            id="password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            error={errors.password?.message}
            {...register("password")}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Registrando..." : "Crear Cuenta de Entrenador"}
          </Button>
        </div>
      </FormStep>
    </form>
  );
}

export { CoachForm };
