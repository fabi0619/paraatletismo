import { useQuery } from '@tanstack/react-query';
import { professorsService, type Professor } from '../api/professorsService';

export function useProfessors() {
  return useQuery<Professor[], Error>({
    queryKey: ['professors'],
    queryFn: professorsService.getProfessors,
  });
}

export function useProfessor(id: string) {
  return useQuery<Professor | null, Error>({
    queryKey: ['professor', id],
    queryFn: () => professorsService.getProfessorById(id),
    enabled: !!id,
  });
}

export function useProfessorAchievements(id: string) {
  return useQuery<any[], Error>({
    queryKey: ['professorAchievements', id],
    queryFn: () => professorsService.getProfessorAchievements(id),
    enabled: !!id,
  });
}


