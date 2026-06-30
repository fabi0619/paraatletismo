import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { athletesService, type Athlete } from '../api/athletesService';

export function useAthletes(initialData?: Athlete[]) {
  return useQuery<Athlete[], Error>({
    queryKey: ['athletes'],
    queryFn: athletesService.getAthletes,
    initialData,
  });
}

export function useAthlete(id: string, initialData?: Athlete | null) {
  return useQuery<Athlete | null, Error>({
    queryKey: ['athletes', id],
    queryFn: () => athletesService.getAthleteById(id),
    enabled: !!id,
    initialData,
  });
}

export function useDeleteAthlete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: athletesService.deleteAthlete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
    },
  });
}
