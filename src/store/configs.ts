import { useQuery } from '@tanstack/react-query';

import * as configsAPI from '$src/api/configs';
import { useApiConfig } from '$src/store/app';

export function useClashConfig() {
  const apiConfig = useApiConfig();
  return useQuery(['/configs', apiConfig] as const, configsAPI.fetchConfigs2);
}
