import React, { useEffect, useState } from 'react';
import { Bubble } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend);
const BubbleGraph = ({ data }) => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const datadb = ["topic", "cost", "count"];

  useEffect(() => {
    const bubbleData = data.map((item) => ({
      x: "Topic: " + item[datadb[0]],
      y: item[datadb[2]],
      r: item[datadb[1]],
    }));

    setChartData({
      datasets: [
        {
          label: 'Bubble Chart',
          data: bubbleData,
          backgroundColor: 'rgba(75,192,192,0.6)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    }); 
  }, [data]);

  return (
    <Bubble
      data={chartData}
      options={{
        scales: {
          x: {
            type: 'category',
            position: 'bottom',
          },
          y: {
            type: 'linear',
            position: 'left',
            ticks: {
              callback: (value) => "Count: " + value,
            },
          },
        },
      }}
    />
  );
};

export default BubbleGraph;
