
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import { AuthProvider } from "context/AuthContext";
import PrivateRoute from "components/PrivateRouter/PrivateRoute";
import Logout from "views/templates/Logout";
import Login from "views/templates/Login";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<PrivateRoute component={AdminLayout} />} />
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
      <Route path="/logout" element={<Logout />} />
      
    </Routes>
  </BrowserRouter>
  </AuthProvider>
);
