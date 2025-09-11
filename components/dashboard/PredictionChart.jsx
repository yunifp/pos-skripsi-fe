"use client";
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
  TimeScale,
  TimeSeriesScale,
} from "chart.js";
import moment from "moment";
import 'chartjs-adapter-moment';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale
);

const PredictionChart = ({ predictionData = [], actualData = [] }) => {
  // Gabungkan data aktual dan prediksi ke dalam format yang sama
   const actualChartData = actualData.map(item => ({
    x: moment(item.date).format('YYYY-MM-DD'),
    y: item.total,
  }));

  const predictionChartData = predictionData.map(item => ({
    x: moment(item.prediction_date).format('YYYY-MM-DD'),
    y: item.prediction_value,
  }));


  const data = {
    datasets: [
      {
        label: "Penjualan Aktual",
        data: actualChartData,
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsla(var(--primary), 0.2)",
        fill: false,
        tension: 0.3,
      },
      {
        label: "Prediksi Penjualan (ARIMA)",
        data: predictionChartData,
        borderColor: "hsl(var(--destructive))",
        backgroundColor: "hsla(var(--destructive), 0.2)",
        borderDash: [5, 5], // Membuat garis putus-putus
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Perbandingan Penjualan Aktual dan Prediksi 30 Hari ke Depan",
        font: {
          size: 16,
        }
      },
      tooltip: {
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(context.parsed.y);
                }
                return label;
            }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'DD MMM YYYY',
          displayFormats: {
            day: 'DD MMM'
          }
        },
        title: {
            display: true,
            text: 'Tanggal'
        }
      },
      y: {
        beginAtZero: true,
        title: {
            display: true,
            text: 'Total Penjualan (IDR)'
        },
        ticks: {
            callback: function(value) {
                return 'Rp ' + new Intl.NumberFormat('id-ID').format(value);
            }
        }
      },
    },
  };

  return (
    <div style={{ height: '450px' }}>
         <Line data={data} options={options} />
    </div>
  );
};

export default PredictionChart;
