import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'src/components/StateProvider';
import { getClashAPIConfig } from 'src/store/app';

const mapState = (s) => ({
  apiConfig: getClashAPIConfig(s),
});

function HeadImpl({ apiConfig }: { apiConfig: { baseURL: string } }) {
  let title = 'yacd';
  try {
    title = new URL(apiConfig.baseURL).host;
  } catch (e) {
    // ignore
  }
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}

export const Head = connect(mapState)(HeadImpl);
