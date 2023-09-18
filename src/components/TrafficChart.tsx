import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { State } from '$src/store/types';
import { ClashAPIConfig } from '$src/types';

import { fetchData } from '../api/traffic';
import useLineChart from '../hooks/useLineChart';
import { chartJSResource, chartStyles, commonDataSetProps } from '../misc/chart';
import { getClashAPIConfig, getSelectedChartStyleIndex } from '../store/app';
import { connect } from './StateProvider';

const { useMemo } = React;

const chartWrapperStyle: React.CSSProperties = {
  // make chartjs chart responsive
  position: 'relative',
  maxWidth: 1000,
};

const mapState = (s: State) => ({
  apiConfig: getClashAPIConfig(s),
  selectedChartStyleIndex: getSelectedChartStyleIndex(s),
});

export default connect(mapState)(TrafficChart);

function TrafficChart({
  apiConfig,
  selectedChartStyleIndex,
}: {
  apiConfig: ClashAPIConfig;
  selectedChartStyleIndex: number;
}) {
  const ChartMod = chartJSResource.read();
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
    [traffic, selectedChartStyleIndex, t],
  );

  useLineChart(ChartMod.Chart, 'trafficChart', data, traffic);

  return (
    <div style={chartWrapperStyle}>
      <canvas id="trafficChart" />
    </div>
  );
}
