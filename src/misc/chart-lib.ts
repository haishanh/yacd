import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
} from 'chart.js';

// see https://www.chartjs.org/docs/latest/getting-started/integration.html#bundlers-webpack-rollup-etc
Chart.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Legend,
);

export { Chart };
