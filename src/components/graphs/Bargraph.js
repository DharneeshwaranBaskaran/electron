import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, BarElement, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, PointElement, BarElement, Tooltip, Legend);
const BarGraph = ({ data }) => {
  const [chartData, setChartData] = useState({labels: [],datasets: []});

  useEffect(() => {
    const labels = data.map((item) => item.topic);
    const countData = data.map((item) => item.count);
    const costData = data.map((item) => item.cost);
    const revenueData = data.map((item) => item.count * item.cost);
    
    setChartData({
      labels: labels,
      datasets: [
        {label: 'Count',data: countData,backgroundColor: 'rgba(75,192,192,0.2)',borderColor: 'rgba(75,192,192,1)',borderWidth: 1,},
        {label: 'Cost',data: costData,backgroundColor: 'rgba(255,99,132,0.2)',borderColor: 'rgba(255,99,132,1)',borderWidth: 1,},
        {label: 'Revenue',data: revenueData,backgroundColor: 'rgba(255,205,86,0.2)',borderColor: 'rgba(255,205,86,1)',borderWidth: 1,},
      ],
    });
  }, [data]);

  return (
    <Bar
      data={chartData}
      options={{
        scales: {
          x: {
            type: 'category',
            position: 'bottom',
          },
        },
      }}
    />
  );
};

export default BarGraph;
