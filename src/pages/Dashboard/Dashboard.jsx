import React, { useEffect, useState } from "react";
import DashboardStates from "../../componenets/stats";
import { useGetDashboardStatQuery } from "../../redux/reducers/task/taskThunk";

function AdminDashboard() {

  const { data, isLoading } = useGetDashboardStatQuery();
  return (
    <div className="p-6">
      {isLoading ? <p>Loading....</p> : <DashboardStates data={data} />}
    </div>
  );
}

export default AdminDashboard;
