import React, { useState } from "react";
import { iniciarSesion } from "../../../lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { AthleteForm, CoachForm } from "./form";

export const RegisterForm: React.FC<{ mode: "atleta" | "profesor" }> = ({ mode }) => {
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center py-10">
      {/* ── Main Container ───────────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-4xl rounded-3xl border border-white/60 bg-white/80 p-6 md:p-10 shadow-2xl backdrop-blur-xl mx-4"
        style={{ boxShadow: "0 25px 60px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.6)" }}
      >
        {/* ── Header branding ─ */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, hsl(0,68%,50%) 0%, hsl(348,100%,40%) 100%)",
            }}
          >
            <span
              className="material-icons-round text-white"
              style={{ fontSize: "32px" }}
            >
              person_add
            </span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Registro <span style={{ color: "hsl(0,68%,50%)" }}>Paraatletismo</span>
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Crea tu cuenta en el Portal de Gestión Deportiva
            </p>
          </div>
        </div>

          {generalError && (
            <div className="mb-8 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 backdrop-blur-sm mx-auto max-w-2xl">
              <span className="material-icons-round shrink-0 text-red-400">
                error_outline
              </span>
              <p className="font-medium">{generalError}</p>
            </div>
          )}

          <div className="bg-white/60 rounded-2xl p-2 md:p-6 shadow-inner border border-white">
            {mode === "atleta" ? (
              <AthleteForm
                onSuccess={async (savedAthlete) => {
                  setIsLoading(true);
                  try {
                    const sesion = await iniciarSesion(
                      savedAthlete.correo,
                      savedAthlete.password || "",
                      "atleta",
                    );
                    if (sesion) {
                      window.dispatchEvent(new Event("sesion_change"));
                      window.location.href = "/dashboard";
                    }
                  } catch (error: any) {
                    setGeneralError(
                      "Registro exitoso, pero ocurrió un error al iniciar sesión: " +
                        error.message,
                    );
                  } finally {
                    setIsLoading(false);
                  }
                }}
              />
            ) : (
              <CoachForm
                onSuccess={async (savedCoach) => {
                  setIsLoading(true);
                  try {
                    const sesion = await iniciarSesion(
                      savedCoach.correo,
                      savedCoach.password || "",
                      "profesor",
                    );
                    if (sesion) {
                      window.dispatchEvent(new Event("sesion_change"));
                      window.location.href = "/dashboard";
                    }
                  } catch (error: any) {
                    setGeneralError(
                      "Registro exitoso, pero ocurrió un error al iniciar sesión: " +
                        error.message,
                    );
                  } finally {
                    setIsLoading(false);
                  }
                }}
              />
            )}
          </div>

        <div className="mt-10 border-t border-slate-200/60 pt-6 text-center">
          <p className="text-sm text-slate-500">
            ¿Ya tienes cuenta?{" "}
            <a
              href="/login"
              className="font-bold transition-colors hover:underline underline-offset-4"
              style={{ color: "hsl(0,68%,50%)" }}
            >
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
