import React from 'react';

const HistoryList = ({ history, clearHistory }) => {
    if (history.length === 0) {
        return (
            <div className="empty-state">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <h3>No history yet</h3>
                <p>Your actions will be logged here.</p>
            </div>
        );
    }

    return (
        <div className="history-container glass-panel">
            <div className="history-header">
                <h3>Activity Log</h3>
                <button onClick={clearHistory} className="clear-btn">Clear All</button>
            </div>

            <ul className="history-list">
                {history.map((item) => (
                    <li key={item.id} className="history-item">
                        <div className={`history-icon ${item.type}`}>
                            {item.type === 'add' && <i className="fa-solid fa-plus"></i>}
                            {item.type === 'delete' && <i className="fa-solid fa-trash"></i>}
                            {item.type === 'favorite' && <i className="fa-solid fa-heart"></i>}
                        </div>
                        <div className="history-content">
                            <span className="history-text">{item.message}</span>
                            <span className="history-time">{new Date(item.timestamp).toLocaleTimeString()}</span>
                        </div>
                    </li>
                ))}
            </ul>

            <style>{`
        .history-container {
          padding: 20px;
        }
        
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .clear-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: var(--text-muted);
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
        }
        
        .clear-btn:hover {
          background: rgba(255, 65, 108, 0.2);
          color: #ff416c;
          border-color: #ff416c;
        }

        .history-list {
          list-style: none;
          max-height: 400px;
          overflow-y: auto;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          animation: slideInRight 0.3s ease-out;
        }

        .history-item:last-child {
          border-bottom: none;
        }

        .history-icon {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .history-icon.add { background: rgba(0, 242, 96, 0.2); color: #00f260; }
        .history-icon.delete { background: rgba(255, 65, 108, 0.2); color: #ff416c; }
        .history-icon.favorite { background: rgba(255, 0, 153, 0.2); color: #ff0099; }

        .history-content {
          display: flex;
          flex-direction: column;
        }

        .history-text {
          font-size: 0.95rem;
        }

        .history-time {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </div>
    );
};

export default HistoryList;
