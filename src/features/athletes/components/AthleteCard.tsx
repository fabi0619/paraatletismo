import React from "react";
import type { Athlete } from "../api/athletesService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Medal, UserRound } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface AthleteCardProps {
  athlete: Athlete;
  onClick: () => void;
}

export const AthleteCard: React.FC<AthleteCardProps> = ({
  athlete,
  onClick,
}) => {
  const gold =
    athlete.campeonatos?.filter((c) => c.posicion === "1").length || 0;
  const silver =
    athlete.campeonatos?.filter((c) => c.posicion === "2").length || 0;
  const bronze =
    athlete.campeonatos?.filter((c) => c.posicion === "3").length || 0;

  return (
    <Card
      onClick={onClick}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-b-none border-b-4 border-b-red-500 pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <AspectRatio ratio={4 / 5}>
        <div className="relative h-full w-full overflow-hidden bg-slate-900">
          {athlete.foto ? (
            <>
              <img
                src={athlete.foto}
                alt={athlete.nombre}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-800">
              <UserRound size={64} className="text-slate-400" />
            </div>
          )}
        </div>
      </AspectRatio>

      <CardHeader className="pb-1">
        <CardTitle className="truncate text-lg font-black">
          {athlete.nombre}
        </CardTitle>

        <p className="truncate text-sm font-bold text-red-500">
          {athlete.club || "Atleta Valle"}
        </p>

        <p className="truncate text-xs text-muted-foreground">
          {[
            athlete.discapacidad?.replace("Discapacidad ", ""),
            athlete.claseDeportiva ? `Clase ${athlete.claseDeportiva}` : null,
          ]
            .filter(Boolean)
            .join(" · ") || "Sin clasificación"}
        </p>
      </CardHeader>

      <CardContent className="mt-auto pt-0">
        <div className="flex items-center gap-4 border-t pt-3">
          <div className="flex items-center gap-1" title="Oro">
            <Medal size={18} className="text-yellow-400" />
            <span className="text-xs font-bold">{gold}</span>
          </div>

          <div className="flex items-center gap-1" title="Plata">
            <Medal size={18} className="text-slate-400" />
            <span className="text-xs font-bold">{silver}</span>
          </div>

          <div className="flex items-center gap-1" title="Bronce">
            <Medal size={18} className="text-orange-500" />
            <span className="text-xs font-bold">{bronze}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
