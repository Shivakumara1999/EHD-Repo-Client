import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import CommonLayout from "./Layout";
import { useContext, useEffect, useState } from "react";
import { contextAuth } from "./GlobalState";
import { Login } from "./LoginComponent";
import ITDepart from "../Ticketing/TicketingSystem";
import CreateTicket from "../User/createTicket";
import Viewhistory from "../User/ViewticketHistory";
import EmployeeComponent from "../Admin/Employee/Employee";
import Configuration from "../Admin/Configuration/configuration";
import { Escalation } from "../Admin/Escalation/escalation";

export function RoutingComponent() {
  const [role, setRole] = useContext<any>(contextAuth);

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate("/");
      setIsAuthenticated(false);
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated.toString());
  }, [isAuthenticated]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
      {/* User routes */}
      <Routes>
        <Route
          path="/user/overview"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <h1>Overview</h1>
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/user/createTicket"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <CreateTicket />
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/user/viewTicket"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <Viewhistory />
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
      {/* Admin routes */}
      <Routes>
        <Route
          path="/admin/dashboard"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <h1>Hey admin</h1>
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/admin/escalations"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <Escalation />
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/admin/employees"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <EmployeeComponent />
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/admin/configurations"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <Configuration />
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/admin/createTicket"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <CreateTicket />
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/admin/viewTicket"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <Viewhistory />
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
      {/* IT ticketing routes */}
      <Routes>
        <Route
          path="/ticketing/overview"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <h1>Hi IT</h1>
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/ticketing/management"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <ITDepart />
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/ticketing/createTicket"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <CreateTicket />
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/ticketing/viewTicket"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <Viewhistory />
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
      {/* Payroll ticketing routes */}
      {/* <Routes>
        <Route
          path="/ticketing/overviewPy"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <h1>Hi payroll</h1>
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/ticketing/payroll"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <h1>Payroll Tickets are here</h1>
                <ITDepart />
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/ticketing/createTicketPy"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <h1>Create ticket py</h1>
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/ticketing/viewTicketPy"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <h1>View Ticket py</h1>
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
      {/* Facility ticketing routes 
      <Routes>
        <Route
          path="/ticketing/overviewFc"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <h1>Hi facility</h1>
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/ticketing/facility"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <h1>Facility Tickets are here</h1>
                <ITDepart />
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/ticketing/createTicketFc"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <h1>Create ticket Facility</h1>
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/ticketing/viewTicketFC"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <h1>View Ticket Facility</h1>
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes> */}
    </div>
  );
}
