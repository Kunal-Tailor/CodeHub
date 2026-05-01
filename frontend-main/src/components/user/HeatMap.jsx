import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

// Function to generate random activity
const generateActivityData = (startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const count = Math.floor(Math.random() * 50);
    data.push({
      date: currentDate.toISOString().split("T")[0], //YYYY-MM-DD
      count: count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

const getPanelColors = (maxCount) => {
  const colors = {};
  for (let i = 0; i <= maxCount; i++) {
    const greenValue = Math.floor((i / maxCount) * 255);
    colors[i] = `rgb(0, ${greenValue}, 0)`;
  }

  return colors;
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);
  const [panelColors, setPanelColors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // Use current year for the heatmap
      const now = new Date();
      const year = now.getFullYear();
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      const data = generateActivityData(startDate, endDate);
      setActivityData(data);

      const maxCount = Math.max(...data.map((d) => d.count));
      setPanelColors(getPanelColors(maxCount));
    };

    fetchData();
  }, []);

  const now = new Date();
  const year = now.getFullYear();

  return (
    <div>
      <h4 style={{ marginBottom: "16px", fontSize: "14px", fontWeight: 600 }}>
        {activityData.reduce((sum, d) => sum + d.count, 0)} contributions in {year}
      </h4>
      <HeatMap
        className="HeatMapProfile"
        style={{ maxWidth: "100%", height: "200px", color: "var(--color-text-muted)" }}
        value={activityData}
        weekLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
        startDate={new Date(`${year}-01-01`)}
        rectSize={12}
        space={3}
        rectProps={{
          rx: 2,
        }}
        panelColors={panelColors}
      />
    </div>
  );
};

export default HeatMapProfile;
