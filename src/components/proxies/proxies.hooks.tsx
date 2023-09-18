import * as React from 'react';
import { updateProviderByName, updateProviders } from 'src/store/proxies';
import { DispatchFn } from 'src/store/types';
import { ClashAPIConfig } from 'src/types';

const { useCallback, useState } = React;

export function useUpdateProviderItem({
  dispatch,
  apiConfig,
  name,
}: {
  dispatch: DispatchFn;
  apiConfig: ClashAPIConfig;
  name: string;
}) {
  return useCallback(
    () => dispatch(updateProviderByName(apiConfig, name)),
    [apiConfig, dispatch, name],
  );
}

export function useUpdateProviderItems({
  dispatch,
  apiConfig,
  names,
}: {
  dispatch: DispatchFn;
  apiConfig: ClashAPIConfig;
  names: string[];
}): [() => unknown, boolean] {
  const [isLoading, setIsLoading] = useState(false);

  const action = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(updateProviders(apiConfig, names));
    } catch (e) {
      // ignore
    }
    setIsLoading(false);
  }, [apiConfig, dispatch, names, isLoading]);

  return [action, isLoading];
}
