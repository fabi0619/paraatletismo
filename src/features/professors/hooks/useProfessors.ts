import { useQuery } from '@tanstack/react-query';
import { professorsService, type Professor } from '../api/professorsService';

export function useProfessors(initialData?: Professor[]) {
  return useQuery<Professor[], Error>({
    queryKey: ['professors'],
    queryFn: professorsService.getProfessors,
    initialData,
  });
}

export function useProfessor(id: string, initialData?: Professor | null) {
  return useQuery<Professor | null, Error>({
    queryKey: ['professor', id],
    queryFn: () => professorsService.getProfessorById(id),
    enabled: !!id,
    initialData,
  });
}

export function useProfessorAchievements(id: string) {
  return useQuery<any[], Error>({
    queryKey: ['professorAchievements', id],
    queryFn: () => professorsService.getProfessorAchievements(id),
    enabled: !!id,
  });
}


