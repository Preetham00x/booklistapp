import React, { useEffect } from "react";

const Modal = ({ children, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        {children}
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          animation: fadeIn 0.2s ease;
        }

        .modal-content {
          width: 90%;
          max-width: 500px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 40px;
          position: relative;
          background: rgba(20, 20, 40, 0.8); /* Slightly more opaque for readability */
          animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          cursor: pointer;
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: white;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        /* Light mode modal */
        [data-theme="light"] .modal-content {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        [data-theme="light"] .close-btn {
          color: #64748b;
        }

        [data-theme="light"] .close-btn:hover {
          color: #1f2937;
        }

        [data-theme="light"] .modal-content h2 {
          color: #1e293b;
        }
      `}</style>
    </div>
  );
};

export default Modal;
