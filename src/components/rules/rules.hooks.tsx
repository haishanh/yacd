import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useRecoilState } from 'recoil';
import {
  fetchRuleProviders,
  refreshRuleProviderByName,
  updateRuleProviders,
} from 'src/api/rule-provider';
import { fetchRules } from 'src/api/rules';
import { ruleFilterText } from 'src/store/rules';
import type { ClashAPIConfig } from 'src/types';

const { useCallback } = React;

export function useUpdateRuleProviderItem(
  name: string,
  apiConfig: ClashAPIConfig
): [(ev: React.MouseEvent<HTMLButtonElement>) => unknown, boolean] {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(refreshRuleProviderByName, {
    onSuccess: () => {
      queryClient.invalidateQueries('/providers/rules');
    },
  });
  const onClickRefreshButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    mutate({ name, apiConfig });
  };
  return [onClickRefreshButton, isLoading];
}

export function useUpdateAllRuleProviderItems(
  apiConfig: ClashAPIConfig
): [(ev: React.MouseEvent<HTMLButtonElement>) => unknown, boolean] {
  const queryClient = useQueryClient();
  const { data: provider } = useRuleProviderQuery(apiConfig);
  const { mutate, isLoading } = useMutation(updateRuleProviders, {
    onSuccess: () => {
      queryClient.invalidateQueries('/providers/rules');
    },
  });
  const onClickRefreshButton = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    mutate({ names: provider.names, apiConfig });
  };
  return [onClickRefreshButton, isLoading];
}

export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.invalidateQueries('/rules');
    queryClient.invalidateQueries('/providers/rules');
  }, [queryClient]);
}

export function useRuleProviderQuery(apiConfig: ClashAPIConfig) {
  return useQuery(['/providers/rules', apiConfig], () =>
    fetchRuleProviders('/providers/rules', apiConfig)
  );
}

export function useRuleAndProvider(apiConfig: ClashAPIConfig) {
  const { data: rules, isFetching } = useQuery(['/rules', apiConfig], () =>
    fetchRules('/rules', apiConfig)
  );
  const { data: provider } = useRuleProviderQuery(apiConfig);

  const [filterText] = useRecoilState(ruleFilterText);
  if (filterText === '') {
    return { rules, provider, isFetching };
  } else {
    const f = filterText.toLowerCase();
    return {
      rules: rules.filter((r) => r.payload.toLowerCase().indexOf(f) >= 0),
      isFetching,
      provider: {
        byName: provider.byName,
        names: provider.names.filter((t) => t.toLowerCase().indexOf(f) >= 0),
      },
    };
  }
}
