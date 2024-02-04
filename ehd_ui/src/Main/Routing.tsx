import { Route, Routes } from "react-router-dom";
import CommonLayout from "./Layout";
import { useContext } from "react";
import { contextAuth } from "./GlobalState";
import { Login } from "./LoginComponent";

export function RoutingComponent() {
  const [authToken, setAuthToken] = useContext<any>(contextAuth);
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
            <CommonLayout userRoles={authToken}>
              <h1>Overview</h1>
            </CommonLayout>
          }
        />
        <Route
          path="/user/createTicket"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>Create ticket</h1>
            </CommonLayout>
          }
        />
        <Route
          path="/user/viewTicket"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>View Ticket</h1>
            </CommonLayout>
          }
        />
      </Routes>
      {/* Admin routes */}
      <Routes>
        <Route
          path="/admin/dashboard"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>Hey admin</h1>
            </CommonLayout>
          }
        />
        <Route
          path="/admin/escalations"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>Escalations</h1>
            </CommonLayout>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>Your employees</h1>
            </CommonLayout>
          }
        />
        <Route
          path="/admin/configurations"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>Configurations</h1>
            </CommonLayout>
          }
        />
        <Route
          path="/admin/createTicket"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>Create ticket</h1>
            </CommonLayout>
          }
        />
        <Route
          path="/admin/viewTicket"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>View Ticket</h1>
            </CommonLayout>
          }
        />
      </Routes>
      {/* IT ticketing routes */}
      <Routes>
        <Route
          path="/ticketing/overviewIt"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>Hi IT</h1>
            </CommonLayout>
          }
        />
        <Route
          path="/ticketing/it"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>IT Tickets are here</h1>
            </CommonLayout>
          }
        />
        <Route
          path="/ticketing/createTicketIt"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>Create ticket</h1>
            </CommonLayout>
          }
        />
        <Route
          path="/ticketing/viewTicketIt"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>View Ticket</h1>
            </CommonLayout>
          }
        />
      </Routes>
      {/* Payroll ticketing routes */}
      <Routes>
        <Route
          path="/ticketing/overviewPy"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>Hi payroll</h1>
            </CommonLayout>
          }
        />
        <Route
          path="/ticketing/payroll"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>Payroll Tickets are here</h1>
            </CommonLayout>
          }
        />
        <Route
          path="/ticketing/createTicketPy"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>Create ticket py</h1>
            </CommonLayout>
          }
        />
        <Route
          path="/ticketing/viewTicketPy"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>View Ticket py</h1>
            </CommonLayout>
          }
        />
      </Routes>
      {/* Facility ticketing routes */}
      <Routes>
        <Route
          path="/ticketing/overviewFc"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>Hi facility</h1>
            </CommonLayout>
          }
        />
        <Route
          path="/ticketing/facility"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>Facility Tickets are here</h1>
            </CommonLayout>
          }
        />
        <Route
          path="/ticketing/createTicketFc"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>Create ticket Facility</h1>
            </CommonLayout>
          }
        />
        <Route
          path="/ticketing/viewTicketFC"
          element={
            <CommonLayout userRoles={authToken}>
              <h1>View Ticket Facility</h1>
            </CommonLayout>
          }
        />
      </Routes>
    </div>
  );
}
