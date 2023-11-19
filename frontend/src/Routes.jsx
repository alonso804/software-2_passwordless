import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import useAuth from "./state/Auth/useAuth";
import ConfirmRegister from "./components/ConfirmRegister/ConfirmRegister";
import ConfirmLogin from "./components/ConfirmLogin/ConfirmLogin";
import EmailSend from "./components/EmailSend/EmailSend";

function AppRoutes() {
  const { isStartedUp, isAuthenticated } = useAuth();

  return (
    <>
      {isStartedUp && (
        <Routes>
          <Route
            path="/email-send"
            element={isAuthenticated ? <Navigate to="/" /> : <EmailSend />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/confirm-login/:token"
            element={isAuthenticated ? <Navigate to="/" /> : <ConfirmLogin />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/confirm-register/:token"
            element={isAuthenticated ? <Navigate to="/" /> : <ConfirmRegister />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      )}
    </>
  );
}

export default AppRoutes;
