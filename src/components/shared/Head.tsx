import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'src/components/StateProvider';
import { getClashAPIConfig, getClashAPIConfigs } from 'src/store/app';

const mapState = (s) => ({
  apiConfig: getClashAPIConfig(s),
  apiConfigs: getClashAPIConfigs(s),
});

function HeadImpl({ apiConfig, apiConfigs }: { apiConfig: { baseURL: string }, apiConfigs: any[] }) {
  let title = 'yacd';
  if (apiConfigs.length > 1) {
    try {
      const host = new URL(apiConfig.baseURL).host;
      title = `${host} - yacd`;
    } catch (e) {
      // ignore
    }
  }
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}

export const Head = connect(mapState)(HeadImpl);
