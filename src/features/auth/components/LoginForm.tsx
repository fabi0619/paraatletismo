import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../schemas/authSchemas";
import { iniciarSesion } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LoginForm: React.FC = () => {
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

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setGeneralError(null);
    try {
      const session = await iniciarSesion(data.usuario, data.clave, data.rol);
      if (session) {
        // Notify the header so it updates without a full reload
        window.dispatchEvent(new Event("sesion_change"));
        window.location.href = "/dashboard";
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
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      {/* ── Animated background blobs ───────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, hsla(0,68%,50%,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full opacity-10 blur-3xl"
        style={{ background: "hsl(0,68%,50%)" }}
      />

      {/* ── Card ───────────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-xl"
        style={{ boxShadow: "0 25px 60px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.6)" }}
      >
        {/* ── Header branding ─ */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, hsl(0,68%,50%) 0%, hsl(348,100%,40%) 100%)",
            }}
          >
            <span
              className="material-icons-round text-white"
              style={{ fontSize: "28px" }}
            >
              sports_athletics
            </span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Valle{" "}
              <span style={{ color: "hsl(0,68%,50%)" }}>Paraatletismo</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Portal de Gestión Deportiva
            </p>
          </div>
        </div>

        {/* ── Tabs (rol selector) ─ */}
        <Tabs
          defaultValue="profesor"
          onValueChange={(value) => {
            setValue("rol", value as "atleta" | "profesor");
            setGeneralError(null);
          }}
          className="w-full"
        >
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="profesor" className="gap-1.5">
              <span className="material-icons-round" style={{ fontSize: "15px" }}>
                school
              </span>
              Entrenador
            </TabsTrigger>
            <TabsTrigger value="atleta" className="gap-1.5">
              <span className="material-icons-round" style={{ fontSize: "15px" }}>
                directions_run
              </span>
              Atleta
            </TabsTrigger>
          </TabsList>

          {/* Error banner */}
          {generalError && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
              <span className="material-icons-round mt-0.5 shrink-0 text-red-400" style={{ fontSize: "18px" }}>
                error_outline
              </span>
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-5">
              {/* Email */}
              <div className="grid gap-1.5">
                <Label htmlFor="usuario" className="text-sm font-semibold text-slate-700">
                  Correo Electrónico
                </Label>
                <Input
                  id="usuario"
                  type="email"
                  placeholder="ejemplo@valle.co"
                  disabled={isLoading}
                  autoComplete="email"
                  {...register("usuario")}
                />
                {errors.usuario && (
                  <span className="text-xs font-medium text-red-500">
                    {errors.usuario.message}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-1.5">
                <Label htmlFor="clave" className="text-sm font-semibold text-slate-700">
                  Contraseña
                </Label>
                <Input
                  id="clave"
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="current-password"
                  {...register("clave")}
                />
                {errors.clave && (
                  <span className="text-xs font-medium text-red-500">
                    {errors.clave.message}
                  </span>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="mt-1 w-full gap-2 font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(0,68%,50%) 0%, hsl(348,100%,42%) 100%)",
                  border: "none",
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="material-icons-round animate-spin"
                      style={{ fontSize: "18px" }}
                    >
                      autorenew
                    </span>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <span className="material-icons-round" style={{ fontSize: "18px" }}>
                      login
                    </span>
                    Iniciar Sesión
                  </>
                )}
              </Button>

              {/* Register link */}
              <p className="text-center text-sm text-slate-500">
                ¿No tienes cuenta?{" "}
                <a
                  href="/registro"
                  className="font-semibold underline-offset-4 hover:underline"
                  style={{ color: "hsl(0,68%,50%)" }}
                >
                  Regístrate aquí
                </a>
              </p>
            </div>
          </form>
        </Tabs>

        {/* ── Admin link ─ */}
        <div className="mt-6 border-t border-slate-100 pt-4 text-center">
          <a
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-slate-600"
          >
            <span className="material-icons-round" style={{ fontSize: "13px" }}>
              admin_panel_settings
            </span>
            Acceso Administrador
          </a>
        </div>
      </div>
    </div>
  );
};
