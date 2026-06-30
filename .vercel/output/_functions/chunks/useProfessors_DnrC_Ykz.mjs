import { useQuery } from '@tanstack/react-query';
import { p as professorsService } from './professorsService_B4TlaCRS.mjs';

function useProfessors(initialData) {
  return useQuery({
    queryKey: ["professors"],
    queryFn: professorsService.getProfessors,
    initialData
  });
}
function useProfessor(id, initialData) {
  return useQuery({
    queryKey: ["professor", id],
    queryFn: () => professorsService.getProfessorById(id),
    enabled: !!id,
    initialData
  });
}
function useProfessorAchievements(id) {
  return useQuery({
    queryKey: ["professorAchievements", id],
    queryFn: () => professorsService.getProfessorAchievements(id),
    enabled: !!id
  });
}

export { useProfessorAchievements as a, useProfessors as b, useProfessor as u };
