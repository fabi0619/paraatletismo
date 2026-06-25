import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logrosService, type Logro } from '../api/logrosService';

export function useLogros() {
  return useQuery<Logro[], Error>({
    queryKey: ['logros'],
    queryFn: logrosService.getLogros,
  });
}

export function useCreateLogro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logrosService.saveLogro,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logros'] });
    },
  });
}
