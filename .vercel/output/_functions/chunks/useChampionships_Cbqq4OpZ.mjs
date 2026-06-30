import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { c as championshipsService } from './championshipsService_DznYA8jA.mjs';

function useChampionships() {
  return useQuery({
    queryKey: ["championships"],
    queryFn: championshipsService.getChampionships
  });
}
function useCreateChampionship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: championshipsService.saveChampionship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["championships"] });
    }
  });
}

export { useCreateChampionship as a, useChampionships as u };
