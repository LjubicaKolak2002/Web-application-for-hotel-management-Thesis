import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Statistics.scss";
import LoadingComponent from "../../UI/Loading/Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(null);

  // novi state za prikaza grafikona
  const [showOccupancyPercent, setShowOccupancyPercent] = useState(true);
  const [showRoomStatusPercent, setShowRoomStatusPercent] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5200/api/statistics?year=${year}`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error fetching statistics:", err));
  }, [year]);

  if (!data) return <LoadingComponent />;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const incomeData = {
    labels: months,
    datasets: [
      {
        label: "Monthly Earnings",
        backgroundColor: "rgba(85, 54, 154, 0.7)",
        borderColor: "rgba(85, 54, 154, 1)",
        borderWidth: 1,
        data: data.monthlyIncome,
        hoverBackgroundColor: "rgba(66, 38, 119, 0.8)",
        hoverBorderColor: "rgba(66, 38, 119, 0.8)",
      },
    ],
  };
  const incomeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...data.monthlyIncome) * 1.1 || undefined,
        ticks: {
          color: "#555",
          font: { size: 12, family: `"Roboto", sans-serif` },
        },
        grid: { color: "#e0e0e0" },
      },
      x: {
        ticks: {
          color: "#555",
          font: { size: 12, family: `"Roboto", sans-serif` },
        },
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#333",
          font: { size: 14, family: `"Roboto", sans-serif` },
        },
      },
    },
  };

  const totalRooms = data.totalRooms || 100;
  const occupancyValues = showOccupancyPercent
    ? [
        parseFloat(data.occupancyRateOverall.toFixed(2)),
        parseFloat((100 - data.occupancyRateOverall).toFixed(2)),
      ]
    : [
        Math.round((data.occupancyRateOverall / 100) * totalRooms),
        totalRooms - Math.round((data.occupancyRateOverall / 100) * totalRooms),
      ];

  const occupancyData = {
    labels: ["Occupied", "Available"],
    datasets: [
      {
        data: occupancyValues,
        backgroundColor: ["rgba(85, 54, 154, 0.7)", "#c2d6d6"],
      },
    ],
  };
  const occupancyOptions = {
    cutout: "80%",
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#333",
          font: { size: 13, family: `"Roboto", sans-serif` },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (showOccupancyPercent) {
              return `${context.label}: ${context.parsed}%`;
            } else {
              return `${context.label}: ${context.parsed}`;
            }
          },
        },
      },
    },
  };

  //zbroji sve sobe radi racunanja postotaka
  const roomStatusTotal =
    (data.roomStatusCounts.dirty || 0) +
      (data.roomStatusCounts.clean || 0) +
      (data.roomStatusCounts.blocked || 0) || 1;
  const roomStatusValues = showRoomStatusPercent
    ? [
        ((data.roomStatusCounts.dirty || 0) / roomStatusTotal) * 100,
        ((data.roomStatusCounts.clean || 0) / roomStatusTotal) * 100,
        ((data.roomStatusCounts.blocked || 0) / roomStatusTotal) * 100,
      ].map((v) => parseFloat(v.toFixed(2)))
    : [
        data.roomStatusCounts.dirty || 0,
        data.roomStatusCounts.clean || 0,
        data.roomStatusCounts.blocked || 0,
      ];

  const roomStatusData = {
    labels: ["Dirty", "Clean", "Blocked"],
    datasets: [
      {
        data: roomStatusValues,
        backgroundColor: ["#c2d6d6", "rgba(85, 54, 154, 0.7)", "#f95959"],
      },
    ],
  };
  const roomStatusOptions = {
    cutout: "80%",
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#333",
          font: { size: 13, family: `"Roboto", sans-serif` },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (showRoomStatusPercent) {
              return `${context.label}: ${context.parsed.toFixed(2)}%`;
            } else {
              return `${context.label}: ${context.parsed}`;
            }
          },
        },
      },
    },
  };

  return (
    <div className="statistics">
      <section className="statistics__topWrapper">
        <div className="infoPanel">
          <h2 className="statistics__header">General Info</h2>
          <div className="statistics__infoGroup">
            {/* Row 1 */}
            <div className="statRow">
              <div className="statCard">
                <p className="statCard__label">Number of babies</p>
                <p className="statCard__value">{data.totalBabies}</p>
              </div>
              <div className="statCard">
                <p className="statCard__label">Number of guests</p>
                <p className="statCard__value">{data.totalAdults}</p>
              </div>
            </div>
            {/* Row 2 */}
            <div className="statRow">
              <div className="statCard">
                <p className="statCard__label">Available rooms</p>
                <p className="statCard__value">{data.availableRooms}</p>
              </div>
              <div className="statCard">
                <p className="statCard__label">Occupancy (30d)</p>
                <p className="statCard__value">
                  {data.occupancyRateLast30.toFixed(2)}%
                </p>
              </div>
            </div>
            {/* Row 3 */}
            <div className="statRow">
              <div className="statCard">
                <p className="statCard__label">Reviews (30d)</p>
                <p className="statCard__value">{data.reviewsCountLast30}</p>
              </div>
              <div className="statCard">
                <p className="statCard__label">Average rating</p>
                <p className="statCard__value">
                  {data.reviewsAverageAll.toFixed(1)} / 5
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="chartPanel">
          <div className="chartCard">
            <h3 className="chartCard__title">Current Occupancy</h3>
            <Doughnut data={occupancyData} options={occupancyOptions} />
            <p className="chartCard__subtitle"></p>
            <button
              className="toggleButton1"
              onClick={() => setShowOccupancyPercent((prev) => !prev)}
            >
              Show {showOccupancyPercent ? "numbers" : "percentages"}
            </button>
          </div>

          <div className="chartCard">
            <h3 className="chartCard__title">Room Statuses</h3>
            <Doughnut data={roomStatusData} options={roomStatusOptions} />
            <button
              className="toggleButton2"
              onClick={() => setShowRoomStatusPercent((prev) => !prev)}
            >
              Show {showRoomStatusPercent ? "numbers" : "percentages"}
            </button>
          </div>
        </div>
      </section>

      <section className="statistics__bottom earningsPanel">
        <div className="earningsHeader">
          <label className="yearLabel">
            Select a year to check earnings:
            <input
              type="number"
              value={year}
              onChange={(e) => {
                const y = parseInt(e.target.value, 10);
                if (!isNaN(y) && y >= 2000 && y <= 2100) {
                  setYear(y);
                }
              }}
              min="2020"
              max="2025"
            />
          </label>
        </div>

        <div className="barChartCard">
          <Bar data={incomeData} options={incomeOptions} />
        </div>

        <div className="earningsInfo">
          <h3 className="earningsInfo__title">Income Summary</h3>
          <p className="earningsInfo__line">
            <span>Total income for {data.year}:</span>
            <strong className="earningsInfo__value">
              {data.totalIncome.toFixed(2)} EUR
            </strong>
          </p>
          <p className="earningsInfo__line">
            <span>Income (last 30 days):</span>
            <strong className="earningsInfo__value">
              {data.earningsLast30.toFixed(2)} EUR
            </strong>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Statistics;
