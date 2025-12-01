
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type StudentProgressChartProps = {
  data: {
    assignments: number[]; 
    tests: number[];
    exams: number[];
    attendance: number[];
  };
};



const DashboardChart = ({ data }: StudentProgressChartProps) => {
  // data: { assignments: [], tests: [], exams: [], attendance: [] }

 const chartData = {
    labels: ["1st Term", "2nd Term", "3rd Term"],
    datasets: [
      {
        label: "Assignments (%)",
        data: data.assignments,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Tests (%)",
        data: data.tests,
        backgroundColor: "rgba(255, 206, 86, 0.7)",
      },
      {
        label: "Exams (%)",
        data: data.exams,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
      {
        label: "Attendance (%)",
        data: data.attendance,
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Student Progress Across Terms",
        font: { size: 18 },
      },
      legend: { position: "top" },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Percentage (%)",
        },
      },
    },
  };

  return (
    <div className="h-full w-full p-4 items-center justify-center flex">
      <Bar data={chartData}  options={options}/>
    </div>
  );
};

export default DashboardChart;
