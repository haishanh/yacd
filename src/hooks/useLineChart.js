import React from 'react';
import { commonChartOptions } from '../misc/chart';

const { useEffect } = React;
const options = commonChartOptions;

export default function useLineChart(
  Chart,
  elementId,
  data,
  subscription,
  extraChartOptions = {}
) {
  useEffect(() => {
    const ctx = document.getElementById(elementId).getContext('2d');
    const c = new Chart(ctx, {
      type: 'line',
      data,
      options: { ...options, ...extraChartOptions }
    });
    const unsubscribe =
      subscription && subscription.subscribe(() => c.update());
    return () => {
      unsubscribe && unsubscribe();
      c.destroy();
    };
  }, [Chart, elementId, data, subscription, extraChartOptions]);
}
