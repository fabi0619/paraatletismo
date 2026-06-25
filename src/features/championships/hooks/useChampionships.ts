import { useQuery } from '@tanstack/react-query';
import { championshipsService, type ChampionshipExtended } from '../api/championshipsService';

export function useChampionships() {
  return useQuery<ChampionshipExtended[], Error>({
    queryKey: ['championships'],
    queryFn: championshipsService.getChampionships,
  });
}
