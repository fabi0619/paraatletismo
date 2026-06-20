import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema, type AdminLoginInput } from "../schemas/authSchemas";
import { iniciarSesion } from "../../../lib/supabase";
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

export const AdminLoginForm: React.FC = () => {
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      usuario: "",
      clave: "",
    },
  });

  const onSubmit = async (data: AdminLoginInput) => {
    setIsLoading(true);
    setGeneralError(null);
    try {
      const session = await iniciarSesion(data.usuario, data.clave, "admin");
      if (session) {
        window.location.href = "/";
      } else {
        setGeneralError("Credenciales de administrador incorrectas.");
      }
    } catch (error: any) {
      setGeneralError(error.message || "Error al iniciar sesión como administrador.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <Card className="border-slate-800 shadow-2xl relative overflow-hidden bg-slate-900 text-slate-100">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-900/10 rounded-full blur-2xl pointer-events-none" />

        <CardHeader className="text-center relative z-10">
          <div className="flex justify-center mb-2">
            <span className="material-icons-round text-red-500 text-4xl animate-pulse">
              admin_panel_settings
            </span>
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-white">
            ADMIN <span className="text-red-500 font-extrabold">PANEL</span>
          </CardTitle>
          <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">
            Ingreso de Administrador
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          {generalError && (
            <div className="mb-6 p-4 bg-red-950/40 border border-red-900/50 rounded-lg text-sm font-medium text-red-400">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="usuario" className="text-slate-400">Usuario Administrador <span className="text-red-500">*</span></Label>
                <Input
                  id="usuario"
                  placeholder="admin"
                  disabled={isLoading}
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus-visible:ring-red-500"
                  {...register("usuario")}
                />
                {errors.usuario && (
                  <span className="text-xs text-red-500 font-medium">{errors.usuario.message}</span>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="clave" className="text-slate-400">Contraseña <span className="text-red-500">*</span></Label>
                <Input
                  id="clave"
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-700 focus-visible:ring-red-500"
                  {...register("clave")}
                />
                {errors.clave && (
                  <span className="text-xs text-red-500 font-medium">{errors.clave.message}</span>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-red-600 hover:bg-red-700 text-white mt-2"
              >
                {isLoading ? "Validando credenciales..." : "Acceder al Panel"}
              </Button>

              <div className="text-center text-sm pt-2">
                <a href="/login" className="text-slate-500 hover:text-slate-300 underline underline-offset-4 transition-colors">
                  Volver al ingreso general
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
