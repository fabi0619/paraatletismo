import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { athletesService, type Athlete } from '../api/athletesService';

export function useAthletes() {
  return useQuery<Athlete[], Error>({
    queryKey: ['athletes'],
    queryFn: athletesService.getAthletes,
  });
}

export function useAthlete(id: string) {
  return useQuery<Athlete | null, Error>({
    queryKey: ['athletes', id],
    queryFn: () => athletesService.getAthleteById(id),
    enabled: !!id,
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
