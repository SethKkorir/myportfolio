// src/pages/admin/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Sun,
  Moon
} from "lucide-react";
import "./admin.css";

const Login = () => {
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regSecret, setRegSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", text: "" });
  const [theme, setTheme] = useState(localStorage.getItem("admin-theme") || "dark");

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("admin-theme", nextTheme);
  };

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert({ type: "", text: "" }), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("adminToken", data.token);

      showAlert("success", "Authentication successful");

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1200);
    } catch (err) {
      showAlert("error", err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          registrationSecret: regSecret,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      showAlert("success", "Admin account created");

      setIsRegistering(false);
      setRegSecret("");
      setPassword("");
    } catch (err) {
      showAlert("error", err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-scope-wrapper" data-theme={theme}>
      <div className="admin-login-screen">
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            backgroundColor: 'var(--admin-bg-card)',
            border: '1px solid var(--admin-border-light)',
            display: 'flex',
            alignItems: 'center',
            justifycontent: 'center', /* Wait! align-items + justify-content handles centering, but let's make it display: flex */
            justifyContent: 'center',
            color: 'var(--admin-text-secondary)',
            cursor: 'pointer',
            boxShadow: 'var(--admin-shadow-sm)',
            zIndex: 100
          }}
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="admin-login-card"
        >
          {/* Floating Alerts Container */}
          <AnimatePresence>
            {alert.text && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className={`admin-float-alert ${
                  alert.type === "success"
                    ? "admin-float-alert-success"
                    : "admin-float-alert-error"
                }`}
              >
                {alert.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logo Brand Header */}
          <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="admin-login-logo-container">
              {isRegistering ? (
                <ShieldAlert size={30} />
              ) : (
                <ShieldCheck size={30} />
              )}
            </div>
            
            <div className="admin-login-header">
              <h1>{isRegistering ? "Create Admin" : "Admin Access"}</h1>
              <p>Seth Portfolio Control Center</p>
            </div>
          </div>

          {/* Form Credentials */}
          <form onSubmit={isRegistering ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Email Field */}
            <div className="admin-input-group">
              <label>Email Address</label>
              <div className="admin-input-wrapper">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="admin-input-field"
                />
                <Mail size={16} className="admin-input-icon" />
              </div>
            </div>

            {/* Password Field */}
            <div className="admin-input-group">
              <label>Password</label>
              <div className="admin-input-wrapper">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="admin-input-field"
                />
                <Lock size={16} className="admin-input-icon" />
              </div>
            </div>

            {/* Registration Secret */}
            {isRegistering && (
              <div className="admin-input-group">
                <label>Registration Secret</label>
                <div className="admin-input-wrapper">
                  <input
                    type="password"
                    required
                    value={regSecret}
                    onChange={(e) => setRegSecret(e.target.value)}
                    placeholder="System secret"
                    className="admin-input-field"
                  />
                  <KeyRound size={16} className="admin-input-icon" />
                </div>
              </div>
            )}

            {/* Submit Action button */}
            <button
              type="submit"
              disabled={loading}
              className="admin-btn-primary"
            >
              {loading ? "Processing..." : isRegistering ? "Create Account" : "Authorize"}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          {/* Toggle Switch */}
          <div className="admin-login-footer">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setAlert({ type: "", text: "" });
              }}
              className="admin-login-toggle-btn"
            >
              {isRegistering ? "Already have access? Login" : "Create admin account"}
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default Login;