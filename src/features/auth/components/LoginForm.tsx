import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../schemas/authSchemas";
import { iniciarSesion } from "../../../lib/supabase";
import { cn } from "../../../lib/utils";
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

export const LoginForm: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<"atleta" | "profesor">("profesor");
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rol: "profesor",
      usuario: "",
      clave: "",
    },
  });

  const handleRoleChange = (role: "atleta" | "profesor") => {
    setSelectedRole(role);
    setValue("rol", role);
    setGeneralError(null);
  };

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setGeneralError(null);
    try {
      const session = await iniciarSesion(data.usuario, data.clave, data.rol);
      if (session) {
        window.location.href = "/";
      } else {
        setGeneralError("Usuario o contraseña incorrectos. Verifique sus credenciales.");
      }
    } catch (error: any) {
      setGeneralError(error.message || "Ocurrió un error inesperado al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tu correo para acceder al portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Selector de Rol */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => handleRoleChange("profesor")}
              className={`py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 ${
                selectedRole === "profesor"
                  ? "bg-white text-red-600 shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Profesor
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("atleta")}
              className={`py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 ${
                selectedRole === "atleta"
                  ? "bg-white text-red-600 shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Atleta
            </button>
          </div>

          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="usuario">Correo Electrónico</Label>
                <Input
                  id="usuario"
                  type="email"
                  placeholder="ejemplo@valle.co"
                  disabled={isLoading}
                  {...register("usuario")}
                />
                {errors.usuario && (
                  <span className="text-xs text-red-500 font-medium">{errors.usuario.message}</span>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="clave">Contraseña</Label>
                <Input
                  id="clave"
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  {...register("clave")}
                />
                {errors.clave && (
                  <span className="text-xs text-red-500 font-medium">{errors.clave.message}</span>
                )}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              <div className="text-center text-sm">
                ¿No tienes cuenta?{" "}
                <a href="/register" className="underline underline-offset-4 hover:text-primary">
                  Regístrate aquí
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
