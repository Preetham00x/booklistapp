import React, { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const Login = ({ onGuestLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // App.jsx effect will handle redirect
    } catch (err) {
      console.error(err);
      setError(`Failed to sign in: ${err.message}`);
    }
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    // Placeholder for actual email/pass auth later
    setError("Email/Password auth requires Firebase configuration. Use Google Sign-In.");
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel">
        <div className="brand-header">
          <div className="brand-logo">
            <i className="fa-solid fa-layer-group"></i>
          </div>
          <h1>Welcome Back</h1>
          <p className="subtitle">Enter your details to access your library</p>
        </div>

        <form onSubmit={handleEmailLogin} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="premium-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="premium-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="premium-btn">
            Sign In
          </button>
        </form>

        {error && <p className="error-message" style={{ color: '#ff416c', marginTop: '10px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <div className="social-login">
          <button className="social-btn google" onClick={handleGoogleLogin}>
            <i className="fa-brands fa-google"></i>
          </button>
          <button className="social-btn apple">
            <i className="fa-brands fa-apple"></i>
          </button>
        </div>

        <div className="guest-option">
          <button className="guest-btn" onClick={onGuestLogin}>
            Continue without signing in
          </button>
        </div>
      </div>

      <style>{`
        .login-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          /* Deep Indigo & Teal Gradient */
          background: linear-gradient(135deg, #1e2024 0%, #232732 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 5000;
          font-family: 'Inter', sans-serif;
        }

        /* Abstract elegant background shapes */
        .login-container::before {
          content: '';
          position: absolute;
          top: -20%;
          left: -10%;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, rgba(76, 29, 149, 0.2), transparent 70%);
          filter: blur(80px);
          border-radius: 50%;
        }

        .login-container::after {
          content: '';
          position: absolute;
          bottom: -20%;
          right: -10%;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, rgba(13, 148, 136, 0.15), transparent 70%);
          filter: blur(80px);
          border-radius: 50%;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 40px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
          z-index: 10;
        }

        .brand-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .brand-logo {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 1.2rem;
          color: white;
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
        }

        .brand-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
          letter-spacing: -0.025em;
        }

        .subtitle {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-group label {
          display: block;
          color: #cbd5e1;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .premium-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          outline: none;
        }

        .premium-input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
          background: rgba(15, 23, 42, 0.8);
        }

        .premium-input::placeholder {
          color: #64748b;
        }

        .premium-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 10px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
        }

        .premium-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
          filter: brightness(1.1);
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 24px 0;
          color: #64748b;
          font-size: 0.8rem;
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .divider span {
          padding: 0 10px;
        }

        .social-login {
          display: flex;
          gap: 16px;
        }

        .social-btn {
          flex: 1;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1.1rem;
        }

        .social-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .guest-option {
            margin-top: 25px;
            text-align: center;
        }
        
        .guest-btn {
            background: transparent;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            font-size: 0.9rem;
            text-decoration: underline;
            transition: color 0.2s;
        }
        
        .guest-btn:hover {
            color: white;
        }
      `}</style>
    </div>
  );
};

export default Login;
