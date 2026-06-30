import React from "react";
import type { Athlete } from "../api/athletesService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Medal, UserRound } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface AthleteCardProps {
  athlete: Athlete;
  onClick: () => void;
  canEdit?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const AthleteCard: React.FC<AthleteCardProps> = ({
  athlete,
  onClick,
  canEdit = false,
  onEdit,
  onDelete,
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
      className="group flex h-full cursor-pointer flex-col overflow-hidden border-white/60 shadow-xl rounded-3xl bg-white/50 backdrop-blur-xl relative transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/70"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <div className="p-3 pb-0">
        <AspectRatio ratio={4 / 5}>
          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-slate-900 shadow-inner">
            {athlete.foto ? (
              <>
                <img
                  src={athlete.foto}
                  alt={athlete.nombre}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-slate-800">
                <UserRound size={64} className="text-slate-400" />
              </div>
            )}

            {canEdit && (
              <div className="absolute top-2 right-2 flex gap-1 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.();
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow hover:bg-white text-slate-700 transition-colors"
                  title="Editar atleta"
                >
                  <span className="material-icons-round text-sm">edit</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow hover:bg-red-50 text-red-600 transition-colors"
                  title="Eliminar atleta"
                >
                  <span className="material-icons-round text-sm">delete</span>
                </button>
              </div>
            )}
          </div>
        </AspectRatio>
      </div>

      <CardHeader className="pb-2 pt-4 px-5 relative z-10">
        <CardTitle className="truncate text-xl font-black text-slate-800 group-hover:text-red-700 transition-colors">
          {athlete.nombre}
        </CardTitle>

        <p className="truncate text-sm font-black text-red-600 drop-shadow-sm">
          {athlete.club || "Atleta Valle"}
        </p>

        <p className="truncate text-xs font-bold text-slate-500 tracking-wide mt-1">
          {[
            athlete.discapacidad?.replace("Discapacidad ", ""),
            athlete.claseDeportiva ? `Clase ${athlete.claseDeportiva}` : null,
          ]
            .filter(Boolean)
            .join(" · ") || "Sin clasificación"}
        </p>
      </CardHeader>

      <CardContent className="mt-auto pt-2 px-5 pb-5 relative z-10">
        <div className="flex items-center gap-3 pt-3 border-t border-white/60">
          <div className="flex items-center gap-1.5 bg-yellow-100/50 px-2 py-1 rounded-full border border-yellow-200/50" title="Oro">
            <Medal size={16} className="fill-yellow-400 text-yellow-600 drop-shadow-sm" />
            <span className="text-xs font-black text-slate-700">{gold}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-200/50 px-2 py-1 rounded-full border border-slate-300/50" title="Plata">
            <Medal size={16} className="fill-slate-300 text-slate-500 drop-shadow-sm" />
            <span className="text-xs font-black text-slate-700">{silver}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-orange-100/50 px-2 py-1 rounded-full border border-orange-200/50" title="Bronce">
            <Medal size={16} className="fill-orange-400 text-orange-600 drop-shadow-sm" />
            <span className="text-xs font-black text-slate-700">{bronze}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
