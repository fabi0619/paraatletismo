import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerCoachSchema,
  type RegisterCoachInput,
} from "../schemas/authSchemas";
import { registrarProfesor, iniciarSesion } from "../../../lib/supabase";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { AthleteForm } from "./AthleteForm";

export const RegisterForm: React.FC = () => {
  const [role, setRole] = useState<"atleta" | "profesor">("atleta");
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Registro Paraatletismo</CardTitle>
          <CardDescription>
            Crea tu cuenta en el Portal de Gestión Deportiva
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Selector de Rol */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl mb-8 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => {
                setRole("atleta");
                setGeneralError(null);
              }}
              className={`py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 ${
                role === "atleta"
                  ? "bg-white text-red-600 shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Registrar Atleta
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("profesor");
                setGeneralError(null);
              }}
              className={`py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 ${
                role === "profesor"
                  ? "bg-white text-red-600 shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Registrar Entrenador
            </button>
          </div>

          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600 max-w-md mx-auto">
              {generalError}
            </div>
          )}

          {role === "profesor" ? (
            <RegisterCoachForm
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setGeneralError={setGeneralError}
            />
          ) : (
            <AthleteForm
              onSuccess={async (savedAthlete) => {
                setIsLoading(true);
                try {
                  const sesion = await iniciarSesion(savedAthlete.correo, savedAthlete.password || "", "atleta");
                  if (sesion) {
                    window.location.href = "/";
                  }
                } catch (error: any) {
                  setGeneralError("Registro exitoso, pero ocurrió un error al iniciar sesión: " + error.message);
                } finally {
                  setIsLoading(false);
                }
              }}
            />
          )}

          <div className="text-center text-sm pt-8 mt-8 border-t border-slate-100">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="underline underline-offset-4 hover:text-primary">
              Inicia Sesión aquí
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================================================
// FORMULARIO REGISTRO PROFESOR
// ============================================================================
interface FormProps {
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  setGeneralError: (val: string | null) => void;
}

const RegisterCoachForm: React.FC<FormProps> = ({
  isLoading,
  setIsLoading,
  setGeneralError,
}) => {
  const {
    register,
    handleSubmit,
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
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="nombre">Nombre Completo</Label>
          <Input
            id="nombre"
            placeholder="Ej. Carlos Arias"
            disabled={isLoading}
            {...register("nombre")}
          />
          {errors.nombre && (
            <span className="text-xs text-red-500 font-medium">{errors.nombre.message}</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="cedula">Cédula</Label>
            <Input
              id="cedula"
              placeholder="Ej. 111820495"
              disabled={isLoading}
              {...register("cedula")}
            />
            {errors.cedula && (
              <span className="text-xs text-red-500 font-medium">{errors.cedula.message}</span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
            <Input
              id="fechaNacimiento"
              type="date"
              disabled={isLoading}
              {...register("fechaNacimiento")}
            />
            {errors.fechaNacimiento && (
              <span className="text-xs text-red-500 font-medium">{errors.fechaNacimiento.message}</span>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="especialidad">Modalidad / Especialidad</Label>
          <Input
            id="especialidad"
            placeholder="Ej. Lanzamientos / Pista"
            disabled={isLoading}
            {...register("especialidad")}
          />
          {errors.especialidad && (
            <span className="text-xs text-red-500 font-medium">{errors.especialidad.message}</span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="correo">Correo Electrónico</Label>
          <Input
            id="correo"
            type="email"
            placeholder="Ej. entrenador@valle.co"
            disabled={isLoading}
            {...register("correo")}
          />
          {errors.correo && (
            <span className="text-xs text-red-500 font-medium">{errors.correo.message}</span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register("password")}
          />
          {errors.password && (
            <span className="text-xs text-red-500 font-medium">{errors.password.message}</span>
          )}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Registrando..." : "Crear Cuenta de Entrenador"}
        </Button>
      </div>
    </form>
  );
};

