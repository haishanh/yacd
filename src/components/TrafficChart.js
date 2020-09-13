import React, { useMemo } from 'react';

import { fetchData } from '../api/traffic';
import useLineChart from '../hooks/useLineChart';
import {
  chartJSResource,
  chartStyles,
  commonDataSetProps,
} from '../misc/chart';
import { getClashAPIConfig, getSelectedChartStyleIndex } from '../store/app';
import { connect } from './StateProvider';

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
  const data = useMemo(
    () => ({
      labels: traffic.labels,
      datasets: [
        {
          ...commonDataSetProps,
          ...chartStyles[selectedChartStyleIndex].up,
          label: 'Up',
          data: traffic.up,
        },
        {
          ...commonDataSetProps,
          ...chartStyles[selectedChartStyleIndex].down,
          label: 'Down',
          data: traffic.down,
        },
      ],
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
