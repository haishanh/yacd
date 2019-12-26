import React, { useMemo } from 'react';
import useLineChart from '../hooks/useLineChart';
import {
  chartJSResource,
  commonDataSetProps,
  chartStyles
} from '../misc/chart';

const extraChartOptions = {
  legend: {
    display: false
  },
  scales: {
    xAxes: [{ display: false }],
    yAxes: [{ display: false }]
  }
};

const data1 = [23e3, 35e3, 46e3, 33e3, 90e3, 68e3, 23e3, 45e3];
const data2 = [184e3, 183e3, 196e3, 182e3, 190e3, 186e3, 182e3, 189e3];
const labels = data1;

export default function TrafficChart({ id }) {
  const Chart = chartJSResource.read();

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          ...commonDataSetProps,
          ...chartStyles[id].up,
          data: data1
        },
        {
          ...commonDataSetProps,
          ...chartStyles[id].down,
          data: data2
        }
      ]
    }),
    [id]
  );

  const eleId = 'chart-' + id;
  useLineChart(Chart, eleId, data, null, extraChartOptions);

  return (
    <div
      style={{
        width: 130,
        padding: 5
      }}
    >
      <canvas id={eleId} />
    </div>
  );
}
