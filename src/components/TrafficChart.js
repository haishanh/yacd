import React, { useMemo } from 'react';
import { fetchData } from '../api/traffic';
import useLineChart from '../hooks/useLineChart';
import { useStoreState } from '../misc/store';
import { getClashAPIConfig, getSelectedChartStyleIndex } from '../ducks/app';
import {
  chartJSResource,
  commonDataSetProps,
  chartStyles
} from '../misc/chart';

const chartWrapperStyle = {
  // make chartjs chart responsive
  position: 'relative',
  maxWidth: 1000
};

const mapStateToProps = s => ({
  selectedChartStyleIndex: getSelectedChartStyleIndex(s)
});

export default function TrafficChart() {
  const Chart = chartJSResource.read();
  const { hostname, port, secret } = useStoreState(getClashAPIConfig);
  const { selectedChartStyleIndex } = useStoreState(mapStateToProps);
  const traffic = fetchData({ hostname, port, secret });
  const data = useMemo(
    () => ({
      labels: traffic.labels,
      datasets: [
        {
          ...commonDataSetProps,
          ...chartStyles[selectedChartStyleIndex].up,
          label: 'Up',
          data: traffic.up
        },
        {
          ...commonDataSetProps,
          ...chartStyles[selectedChartStyleIndex].down,
          label: 'Down',
          data: traffic.down
        }
      ]
    }),
    [traffic, selectedChartStyleIndex]
  );

  useLineChart(Chart, 'trafficChart', data, traffic);

  return (
    <div style={chartWrapperStyle}>
      <canvas id="trafficChart" />
    </div>
  );
}
