import React from "react";
import Navbar from "../navbar";
const DashboardRender = ({ children }) => {
  return (
    <div className="dashboard">
      <Navbar />
      <div className="w-full h-screen overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardRender;
