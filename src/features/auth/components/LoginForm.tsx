import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../schemas/authSchemas";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";

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
        window.location.href = "/";
      } else {
        setGeneralError(
          "Usuario o contrasena incorrectos. Verifique sus credenciales.",
        );
      }
    } catch (error: any) {
      setGeneralError(
        error.message || "Ocurrio un error inesperado al iniciar sesion.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Iniciar Sesion</CardTitle>
          <CardDescription>
            Ingresa tu correo para acceder al portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="profesor"
            onValueChange={(value) => {
              setValue("rol", value as "atleta" | "profesor");
              setGeneralError(null);
            }}
            className="w-full"
          >
            <TabsList className="mb-8 grid w-full grid-cols-2">
              <TabsTrigger value="profesor">Profesor</TabsTrigger>
              <TabsTrigger value="atleta">Atleta</TabsTrigger>
            </TabsList>

            {generalError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600">
                {generalError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="usuario">Correo Electronico</Label>
                  <Input
                    id="usuario"
                    type="email"
                    placeholder="ejemplo@valle.co"
                    disabled={isLoading}
                    {...register("usuario")}
                  />
                  {errors.usuario && (
                    <span className="text-xs text-red-500 font-medium">
                      {errors.usuario.message}
                    </span>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="clave">Contrasena</Label>
                  <Input
                    id="clave"
                    type="password"
                    placeholder="--------"
                    disabled={isLoading}
                    {...register("clave")}
                  />
                  {errors.clave && (
                    <span className="text-xs text-red-500 font-medium">
                      {errors.clave.message}
                    </span>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Iniciando sesion..." : "Iniciar Sesion"}
                </Button>

                <div className="text-center text-sm">
                  No tienes cuenta?{" "}
                  <a
                    href="/register"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Registrate aqui
                  </a>
                </div>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
