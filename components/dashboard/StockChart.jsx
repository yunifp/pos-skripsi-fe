import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockChart = ({ cards }) => {
  const initialStockEntry = {
    created_at: moment(cards[0].created_at).format(),
    current_stock: 0,
  };

  const updatedCards = [...cards, initialStockEntry];

  const labels = updatedCards
    .map((data) => moment(data.created_at).format("DD MMM"))
    .reverse();
  const stockData = updatedCards.map((data) => data.current_stock).reverse();

  const data = {
    labels,
    datasets: [
      {
        lineTension: 0.1,
        label: "Stock",
        data: stockData,
        segment: {
          borderColor: (ctx) => {
            if (ctx.p0 && ctx.p1) {
              const prevValue = ctx.p0.parsed.y;
              const currentValue = ctx.p1.parsed.y;
              return currentValue > prevValue
                ? "rgba(75, 192, 192, 1)" // Green for up
                : "rgba(255, 99, 132, 1)"; // Red for down
            }
            return "rgba(75, 192, 192, 1)"; // Default color
          },
          backgroundColor: (ctx) => {
            if (ctx.p0 && ctx.p1) {
              const prevValue = ctx.p0.parsed.y;
              const currentValue = ctx.p1.parsed.y;
              return currentValue > prevValue
                ? "rgba(75, 192, 192, 0.2)" // Light green fill for up
                : "rgba(255, 99, 132, 0.2)"; // Light red fill for down
            }
            return "rgba(75, 192, 192, 0.2)"; // Default fill
          },
        },
        fill: true,
        borderWidth: 4, // Increase the line thickness
        pointRadius: 4, // Set the size of the dots
        pointBorderWidth: 0, // Remove the border width of the points (optional)
        pointBackgroundColor: (ctx) => {
          return "#00000000"; // Default color
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Current Stock Over Time",
      },
      tooltip: {
        mode: "nearest",
        intersect: false,
      },
    },
    interaction: {
      mode: "nearest",
      intersect: false, // Allows hovering on the line to show the tooltip
    },
    scales: {
      x: {
        ticks: {
          callback: function (value) {
            return this.getLabelForValue(value); // Adjust this if needed for your date formatting
          },
          maxRotation: 90, // Rotate the labels to 90 degrees
          minRotation: 90,
        },
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          //   display: false,
          color: "#0000000A",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default StockChart;
