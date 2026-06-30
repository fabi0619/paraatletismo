import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { a as athletesService } from './QueryProvider__3BIDRjC.mjs';

function useAthletes(initialData) {
  return useQuery({
    queryKey: ["athletes"],
    queryFn: athletesService.getAthletes,
    initialData
  });
}
function useAthlete(id, initialData) {
  return useQuery({
    queryKey: ["athletes", id],
    queryFn: () => athletesService.getAthleteById(id),
    enabled: !!id,
    initialData
  });
}
function useDeleteAthlete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: athletesService.deleteAthlete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    }
  });
}

export { useAthletes as a, useDeleteAthlete as b, useAthlete as u };
