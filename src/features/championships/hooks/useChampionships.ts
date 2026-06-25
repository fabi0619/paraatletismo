import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { championshipsService, type ChampionshipExtended } from '../api/championshipsService';

export function useChampionships() {
  return useQuery<ChampionshipExtended[], Error>({
    queryKey: ['championships'],
    queryFn: championshipsService.getChampionships,
  });
}

export function useCreateChampionship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: championshipsService.saveChampionship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['championships'] });
    },
  });
}
