import { createAsset } from 'use-asset';

import prettyBytes from './pretty-bytes';
export const chartJSResource = createAsset(() => {
  return import('$src/misc/chart-lib');
});

export const commonDataSetProps = { borderWidth: 1, pointRadius: 0, tension: 0.2, fill: true };

export const commonChartOptions: import('chart.js').ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { labels: { boxWidth: 20 } },
  },
  scales: {
    x: { display: false, type: 'category' },
    y: {
      type: 'linear',
      display: true,
      grid: {
        display: true,
        color: '#555',
        drawTicks: false,
      },
      border: {
        display: false,
        dash: [3, 6],
      },
      ticks: {
        callback(value: number) {
          return prettyBytes(value) + '/s ';
        },
      },
    },
  },
};

export const chartStyles = [
  {
    down: {
      backgroundColor: 'rgba(176, 209, 132, 0.8)',
      borderColor: 'rgb(176, 209, 132)',
    },
    up: {
      backgroundColor: 'rgba(181, 220, 231, 0.8)',
      borderColor: 'rgb(181, 220, 231)',
    },
  },
  {
    up: {
      backgroundColor: 'rgb(98, 190, 100)',
      borderColor: 'rgb(78,146,79)',
    },
    down: {
      backgroundColor: 'rgb(160, 230, 66)',
      borderColor: 'rgb(110, 156, 44)',
    },
  },
  {
    up: {
      backgroundColor: 'rgba(94, 175, 223, 0.3)',
      borderColor: 'rgb(94, 175, 223)',
    },
    down: {
      backgroundColor: 'rgba(139, 227, 195, 0.3)',
      borderColor: 'rgb(139, 227, 195)',
    },
  },
  {
    up: {
      backgroundColor: 'rgba(242, 174, 62, 0.3)',
      borderColor: 'rgb(242, 174, 62)',
    },
    down: {
      backgroundColor: 'rgba(69, 154, 248, 0.3)',
      borderColor: 'rgb(69, 154, 248)',
    },
  },
];
