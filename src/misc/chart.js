import { unstable_createResource as createResource } from '@hsjs/react-cache';
import prettyBytes from './pretty-bytes';

export const chartJSResource = createResource(() => {
  return import(
    /* webpackChunkName: "chartjs" */
    /* webpackPrefetch: true */
    /* webpackPreload: true */
    'chart.js/dist/Chart.min.js'
  ).then(c => c.default);
});

export const commonDataSetProps = {
  borderWidth: 1,
  lineTension: 0,
  pointRadius: 0
};

export const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  title: {
    display: false
  },
  legend: {
    display: true,
    position: 'top',
    labels: {
      fontColor: '#ccc',
      boxWidth: 20
    }
  },
  tooltips: {
    enabled: false,
    mode: 'index',
    intersect: false,
    animationDuration: 100
  },
  hover: {
    mode: 'nearest',
    intersect: true
  },
  scales: {
    xAxes: [
      {
        display: false,
        gridLines: {
          display: false
        }
      }
    ],
    yAxes: [
      {
        display: true,
        gridLines: {
          display: true,
          color: '#555',
          borderDash: [3, 6],
          drawBorder: false
        },
        ticks: {
          callback(value) {
            return prettyBytes(value) + '/s ';
          }
        }
      }
    ]
  }
};

export const chartStyles = [
  {
    down: {
      backgroundColor: 'rgba(176, 209, 132, 0.8)',
      borderColor: 'rgb(176, 209, 132)'
    },
    up: {
      backgroundColor: 'rgba(181, 220, 231, 0.8)',
      borderColor: 'rgb(181, 220, 231)'
    }
  },
  {
    up: {
      backgroundColor: 'rgb(98, 190, 100)',
      borderColor: 'rgb(78,146,79)'
    },
    down: {
      backgroundColor: 'rgb(160, 230, 66)',
      borderColor: 'rgb(110, 156, 44)'
    }
  },
  {
    up: {
      backgroundColor: 'rgba(94, 175, 223, 0.3)',
      borderColor: 'rgb(94, 175, 223)'
    },
    down: {
      backgroundColor: 'rgba(139, 227, 195, 0.3)',
      borderColor: 'rgb(139, 227, 195)'
    }
  },
  {
    up: {
      backgroundColor: 'rgba(242, 174, 62, 0.3)',
      borderColor: 'rgb(242, 174, 62)'
    },
    down: {
      backgroundColor: 'rgba(69, 154, 248, 0.3)',
      borderColor: 'rgb(69, 154, 248)'
    }
  }
];

// TODO to remove
export const colorCombo = chartStyles;
