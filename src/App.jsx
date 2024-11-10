import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";
import { useLoginUserMutation, useGetCurrentLoginUserQuery } from "./redux/reducers/user/userThunk";

// Components
import Spinner from "./componenets/spinner/spinner";
import DashboardRender from "./componenets/dashboardRender/dashboardRender";
import Login from "./pages/login/login";
import NotFound from "./pages/Notfount/NotFound";
import { useSelector } from "react-redux";

// Import additional components
import Dashboard from "./pages/Dashboard/Dashboard";
import UserManagement from "./pages/Dashboard/UserManagement";
import TaskManagement from "./pages/Dashboard/TaskManagement";

const App = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { data: currentUser, isLoading: isLoadingUser, error: userError } = useGetCurrentLoginUserQuery({}, {
    skip: !token,
    refetchOnMountOrArgChange: true
  });

  const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();

  const getDashboardPath = (role) => {
    switch (role) {
      case "Admin":
        return "/admin/dashboard";
      case "Manager":
        return "/manager/dashboard";
      case "RegularUser":
        return "/user/dashboard";
      default:
        return "/login";
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const result = await loginUser(credentials).unwrap();
      if (result?.token) {
        localStorage.setItem("token", result.token);
        const dashboardPath = getDashboardPath(result.user.role);
        navigate(dashboardPath);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isLoadingUser || isLoggingIn) {
    return <Spinner />;
  }

  if (userError && token) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  const ProtectedLayout = ({ allowedRoles }) => {
    if (isLoadingUser) {
      return <Spinner />;
    }
  
    if (!token) {
      return <Navigate to="/login" replace />;
    }
  
    if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
      const authorizedDashboard = getDashboardPath(currentUser?.role);
      return <Navigate to={authorizedDashboard} replace />;
    }
  
    return (
      <DashboardRender>
        <Outlet />
      </DashboardRender>
    );
  };

  return (
    // <main className={theme}>
      <Routes>
        <Route 
          path="/login" 
          element={token ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
        />

        {/* Admin Routes */}
        <Route element={<ProtectedLayout allowedRoles={["Admin"]} />}>
          <Route path="/admin" >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="tasks" element={<TaskManagement />} />
          </Route>
        </Route>

        {/* Manager Routes */}
        <Route element={<ProtectedLayout allowedRoles={["Manager"]} />}>
          <Route path="/manager">
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="tasks" element={<TaskManagement />} />
          </Route>
        </Route>

        {/* Regular User Routes */}
        <Route element={<ProtectedLayout allowedRoles={["RegularUser"]} />}>
          <Route path="/user">
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tasks" element={<TaskManagement />} />
          </Route>
        </Route>

        {/* Root redirect */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate to={getDashboardPath(currentUser?.role)} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    // </main>
  );
};

export default App;



