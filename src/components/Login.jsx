import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin({ name: "User", email });
    }
  };

  const handleGoogleLogin = (account) => {
    onLogin({ name: account.name, email: account.email, avatar: account.avatar });
    setShowGoogleModal(false);
  };

  const mockAccounts = [
    { name: "Preetham", email: "preetham@example.com", avatar: "P" },
    { name: "Dev Account", email: "dev@company.com", avatar: "D" }
  ];

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

        <form onSubmit={handleSubmit} className="login-form">
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

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <div className="social-login">
          <button className="social-btn google" onClick={() => setShowGoogleModal(true)}>
            <i className="fa-brands fa-google"></i>
          </button>
          <button className="social-btn apple">
            <i className="fa-brands fa-apple"></i>
          </button>
        </div>
      </div>

      {showGoogleModal && (
        <div className="google-modal-overlay" onClick={() => setShowGoogleModal(false)}>
          <div className="google-modal" onClick={(e) => e.stopPropagation()}>
            <div className="google-header">
              <i className="fa-brands fa-google"></i>
              <h3>Choose an account</h3>
              <p>to continue to BookList</p>
            </div>
            <div className="account-list">
              {mockAccounts.map((account, index) => (
                <div key={index} className="account-item" onClick={() => handleGoogleLogin(account)}>
                  <div className="account-avatar">{account.avatar}</div>
                  <div className="account-info">
                    <span className="account-name">{account.name}</span>
                    <span className="account-email">{account.email}</span>
                  </div>
                </div>
              ))}
              <div className="account-item">
                <div className="account-avatar add"><i className="fa-solid fa-user-plus"></i></div>
                <div className="account-info">
                  <span className="account-name">Use another account</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

        /* Google Modal */
        .google-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 6000;
          animation: fadein 0.2s;
        }
        
        .google-modal {
          background: white;
          color: #333;
          width: 400px;
          border-radius: 8px;
          padding-bottom: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          animation: popin 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }

        .google-header {
          text-align: center;
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .google-header i {
          font-size: 1.5rem;
          color: #db4437; /* Google Red */
          margin-bottom: 10px;
        }

        .google-header h3 {
          font-weight: 500;
          margin: 0;
        }
        
        .google-header p {
          color: #666;
          font-size: 0.9rem;
          margin-top: 5px;
        }

        .account-list {
          display: flex;
          flex-direction: column;
        }

        .account-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 20px;
          cursor: pointer;
          border-bottom: 1px solid #f8f8f8;
          transition: background 0.2s;
        }

        .account-item:hover {
          background: #f5f5f5;
        }

        .account-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: #6366f1;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          font-size: 0.9rem;
        }
        
        .account-avatar.add {
          background: transparent;
          color: #666;
        }

        .account-info {
          display: flex;
          flex-direction: column;
        }

        .account-name {
          font-weight: 500;
          font-size: 0.95rem;
        }

        .account-email {
          font-size: 0.85rem;
          color: #666;
        }
        
        @keyframes popin {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadein {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Login;
