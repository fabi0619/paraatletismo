import { useQuery } from '@tanstack/react-query';
import { professorsService, type Professor } from '../api/professorsService';

export function useProfessors() {
  return useQuery<Professor[], Error>({
    queryKey: ['professors'],
    queryFn: professorsService.getProfessors,
  });
}
