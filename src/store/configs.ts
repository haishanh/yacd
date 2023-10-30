import { useQuery } from '@tanstack/react-query';

import { fetchConfigs2 } from '$src/api/configs';
import { ENDPOINT } from '$src/misc/constants';
import { useApiConfig } from '$src/store/app';

export function useClashConfig() {
  const apiConfig = useApiConfig();
  return useQuery({
    queryKey: [ENDPOINT.config, apiConfig],
    queryFn: fetchConfigs2,
  });
}
