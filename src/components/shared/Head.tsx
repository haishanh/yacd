import { useAtom } from 'jotai';
import * as React from 'react';

import { clashAPIConfigsAtom, useApiConfig } from '$src/store/app';

export function Head() {
  const apiConfig = useApiConfig();
  const [apiConfigs] = useAtom(clashAPIConfigsAtom);
  React.useEffect(() => {
    let title = 'yacd';
    if (apiConfigs.length > 1) {
      try {
        title = `${apiConfig.metaLabel || new URL(apiConfig.baseURL).host} - yacd`;
      } catch (e) {
        // ignore
      }
    }
    document.title = title;
  });

  return <></>;
}
