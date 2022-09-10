import * as React from 'react';
import { connect } from 'src/components/StateProvider';
import { getClashAPIConfig, getClashAPIConfigs } from 'src/store/app';

import { State } from '$src/store/types';
import { ClashAPIConfig } from '$src/types';

const mapState = (s: State) => ({
  apiConfig: getClashAPIConfig(s),
  apiConfigs: getClashAPIConfigs(s),
});

function HeadImpl({ apiConfig, apiConfigs }: { apiConfig: ClashAPIConfig; apiConfigs: any[] }) {
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

export const Head = connect(mapState)(HeadImpl);
