import React, { useEffect } from 'react';
import prettyBytes from 'm/pretty-bytes';
import { fetchData } from '../api/traffic';
import { unstable_createResource as createResource } from 'react-cache';
import { useComponentState } from 'm/store';
import { getClashAPIConfig, getTheme } from 'd/app';

// const delay = ms => new Promise(r => setTimeout(r, ms));
const chartJSResource = createResource(() => {
  return import('chart.js/dist/Chart.min.js').then(c => c.default);
});

const colorCombo = {
  0: {
    down: {
      backgroundColor: 'rgba(176, 209, 132, 0.8)',
      borderColor: 'rgb(176, 209, 132)'
    },
    up: {
      backgroundColor: 'rgba(181, 220, 231, 0.8)',
      borderColor: 'rgb(181, 220, 231)'
    }
  },
  1: {
    up: {
      backgroundColor: 'rgba(242, 174, 62, 0.3)',
      borderColor: 'rgb(242, 174, 62)'
    },
    down: {
      backgroundColor: 'rgba(69, 154, 248, 0.3)',
      borderColor: 'rgb(69, 154, 248)'
    }
  },
  2: {
    up: {
      backgroundColor: 'rgba(94, 175, 223, 0.3)',
      borderColor: 'rgb(94, 175, 223)'
    },
    down: {
      backgroundColor: 'rgba(139, 227, 195, 0.3)',
      borderColor: 'rgb(139, 227, 195)'
    }
  }
};

const commonDataSetProps = {
  borderWidth: 1,
  // lineTension: 0,
  pointRadius: 0
};

function getUploadProps(theme = 'dark') {
  const i = theme === 'dark' ? '0' : '2';
  return {
    ...commonDataSetProps,
    ...colorCombo[i].up,
    label: 'Up'
  };
}

function getDownloadProps(theme = 'dark') {
  const i = theme === 'dark' ? '0' : '2';
  return {
    ...commonDataSetProps,
    ...colorCombo[i].down,
    label: 'Down'
  };
}

const options = {
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
    // it's hard to follow the tooltip while the data is streaming
    // so disable it for now
    enabled: false,
    mode: 'index',
    intersect: false,
    animationDuration: 100
    // callbacks: {
    //   label(tooltipItem, data) {
    //     console.log(tooltipItem);
    //     const { datasetIndex, yLabel } = tooltipItem;
    //     const l = data.datasets[tooltipItem.datasetIndex].label;
    //     console.log(yLabel);
    //     const b = prettyBytes(parseInt(yLabel, 10));
    //     return l + b;
    //   }
    // }
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

const chartWrapperStyle = {
  // make chartjs chart responsive
  position: 'relative',
  width: '90%'
};

export default function TrafficChart() {
  const Chart = chartJSResource.read();
  const { hostname, port, secret } = useComponentState(getClashAPIConfig);
  const theme = useComponentState(getTheme);

  useEffect(
    () => {
      const ctx = document.getElementById('trafficChart').getContext('2d');
      const traffic = fetchData({ hostname, port, secret });
      const upProps = getUploadProps(theme);
      const downProps = getDownloadProps(theme);
      const data = {
        labels: traffic.labels,
        datasets: [
          {
            ...upProps,
            data: traffic.up
          },
          {
            ...downProps,
            data: traffic.down
          }
        ]
      };
      const c = new Chart(ctx, {
        type: 'line',
        data,
        options
      });
      const unsubscribe = traffic.subscribe(() => c.update());
      return () => {
        unsubscribe();
        c.destroy();
      };
    },
    [hostname, port, secret, theme]
  );

  return (
    <div style={chartWrapperStyle}>
      <canvas id="trafficChart" />
    </div>
  );
}
