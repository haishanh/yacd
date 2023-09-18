import * as React from 'react';

import useLineChart from '../hooks/useLineChart';
import { chartJSResource, chartStyles, commonDataSetProps } from '../misc/chart';

const { useMemo } = React;

const extraChartOptions: import('chart.js').ChartOptions<'line'> = {
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: { display: false, type: 'category' },
    y: { display: false, type: 'linear' },
  },
};

const data1 = [23e3, 35e3, 46e3, 33e3, 90e3, 68e3, 23e3, 45e3];
const data2 = [184e3, 183e3, 196e3, 182e3, 190e3, 186e3, 182e3, 189e3];
const labels = data1;

export default function TrafficChart({ id }: { id: string }) {
  const ChartMod = chartJSResource.read();

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          ...commonDataSetProps,
          ...chartStyles[id].up,
          data: data1,
        },
        {
          ...commonDataSetProps,
          ...chartStyles[id].down,
          data: data2,
        },
      ],
    }),
    [id],
  );

  const eleId = 'chart-' + id;
  useLineChart(ChartMod.Chart, eleId, data, null, extraChartOptions);

  return (
    <div style={{ width: 100, padding: 5 }}>
      <canvas id={eleId} />
    </div>
  );
}
