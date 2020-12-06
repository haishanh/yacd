import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { fetchData } from '../api/traffic';
import useLineChart from '../hooks/useLineChart';
import {
  chartJSResource,
  chartStyles,
  commonDataSetProps,
} from '../misc/chart';
import { getClashAPIConfig, getSelectedChartStyleIndex } from '../store/app';
import { connect } from './StateProvider';

const { useMemo } = React;

const chartWrapperStyle = {
  // make chartjs chart responsive
  position: 'relative',
  maxWidth: 1000,
};

const mapState = (s) => ({
  apiConfig: getClashAPIConfig(s),
  selectedChartStyleIndex: getSelectedChartStyleIndex(s),
});

export default connect(mapState)(TrafficChart);

function TrafficChart({ apiConfig, selectedChartStyleIndex }) {
  const Chart = chartJSResource.read();
  const traffic = fetchData(apiConfig);
  const { t } = useTranslation();
  const data = useMemo(
    () => ({
      labels: traffic.labels,
      datasets: [
        {
          ...commonDataSetProps,
          ...chartStyles[selectedChartStyleIndex].up,
          label: t('Up'),
          data: traffic.up,
        },
        {
          ...commonDataSetProps,
          ...chartStyles[selectedChartStyleIndex].down,
          label: t('Down'),
          data: traffic.down,
        },
      ],
    }),
    [traffic, selectedChartStyleIndex, t]
  );

  useLineChart(Chart, 'trafficChart', data, traffic);

  return (
    // @ts-expect-error ts-migrate(2322) FIXME: Type '{ position: string; maxWidth: number; }' is ... Remove this comment to see the full error message
    <div style={chartWrapperStyle}>
      <canvas id="trafficChart" />
    </div>
  );
}
