import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import CommonLayout from "./Layout";
import { useContext, useEffect, useState } from "react";
import { contextAuth } from "./GlobalState";
import { Login } from "./LoginComponent";
import HelpdeskForm from "../User/createTicket";
import Viewhistory from "../User/ViewticketHistory";

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
               <HelpdeskForm/>
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
<Viewhistory/>
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
                <h1>Escalations</h1>
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
                <h1>Your employees</h1>
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
                <h1>Configurations</h1>
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
                <h1>Create ticket</h1>
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
                <h1>View Ticket</h1>
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
          path="/ticketing/overviewIt"
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
          path="/ticketing/it"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <h1>IT Tickets are here</h1>
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/ticketing/createTicketIt"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <h1>Create ticket</h1>
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/ticketing/viewTicketIt"
          element={
            "isAuthenticated" ? (
              <CommonLayout userRoles={role}>
                <h1>View Ticket</h1>
              </CommonLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
      {/* Payroll ticketing routes */}
      <Routes>
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
      {/* Facility ticketing routes */}
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
      </Routes>
    </div>
  );
}
