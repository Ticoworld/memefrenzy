import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Tokenomics = () => {
  // Tokenomics data as an array of objects
  const tokenData = [
    { title: 'Total Supply', value: '1,000,000,000 $MEME tokens (1 BILLION total supply)' },
    { title: 'Presale', value: '55% (550M $MEME)', percentage: 55 },
    { title: 'Liquidity', value: '26.65% (266,475,000 $MEME)', percentage: 26.65 },
    { title: 'CEX Liquidity', value: '17% (170M $MEME)', percentage: 17 },
    { title: 'Team & Community', value: '1.35% (13.5M $MEME)', percentage: 1.35 },
  ];

  // Data for Pie Chart
  const pieChartData = {
    labels: tokenData.slice(1).map((item) => item.title), // Exclude 'Total Supply' from pie chart
    datasets: [
      {
        label: 'Token Distribution',
        data: tokenData.slice(1).map((item) => item.percentage),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  return (
    <section id="tokenomics" className="bg-black text-white py-16" data-aos="fade-up">
      <div className="px-5 md:px-32">
        <h2 className="text-4xl font-bold text-center mb-8">Tokenomics</h2>
        <p className="text-center text-lg mb-8">
          Here's how the $MEME token supply is distributed to maximize growth, sustainability, and a fair launch.
        </p>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-5">
        {/* Left Side Content */}
        <div className="w-full md:w-1/2">
          <div className="flex flex-col justify-between gap-4">
            {tokenData.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-md text-center w-full"
              >
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-yellow-500 text-2xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Content (Pie Chart) */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <h3 className="text-center text-2xl font-semibold mb-4">Token Distribution</h3>
          <Pie data={pieChartData} />
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;