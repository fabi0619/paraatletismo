import React, { useState } from "react";
import { iniciarSesion } from "../../../lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { AthleteForm, CoachForm } from "./form";

export const RegisterForm: React.FC = () => {
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Registro Paraatletismo</CardTitle>
          <CardDescription>
            Crea tu cuenta en el Portal de Gestion Deportiva
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="atleta"
            onValueChange={() => setGeneralError(null)}
            className="w-full"
          >
            <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="atleta">Registrar Atleta</TabsTrigger>
              <TabsTrigger value="profesor">Registrar Entrenador</TabsTrigger>
            </TabsList>

            {generalError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600 max-w-md mx-auto">
                {generalError}
              </div>
            )}

            <TabsContent value="atleta">
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
                      window.location.href = "/";
                    }
                  } catch (error: any) {
                    setGeneralError(
                      "Registro exitoso, pero ocurrio un error al iniciar sesion: " +
                        error.message,
                    );
                  } finally {
                    setIsLoading(false);
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="profesor">
              <CoachForm
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setGeneralError={setGeneralError}
              />
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm pt-8 mt-8 border-t border-slate-100">
            Ya tienes cuenta?{" "}
            <a
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Inicia sesion aquí
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
