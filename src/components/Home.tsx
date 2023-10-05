import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { ContentHeader } from './ContentHeader';
import s0 from './Home.module.scss';
import Loading from './Loading';
import TrafficChart from './TrafficChart';
import TrafficNow from './TrafficNow';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div>
      <ContentHeader title={t('Overview')} />
      <div className={s0.root}>
        <div>
          <TrafficNow />
        </div>
        <div className={s0.chart}>
          <Suspense fallback={<Loading height="200px" />}>
            <TrafficChart />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
