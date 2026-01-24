import React from 'react';

const TasteMatch = ({ matchPercent, sharedGenres, sharedAuthors }) => {
    // Calculate the circle's stroke dasharray for the progress ring
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (matchPercent / 100) * circumference;

    return (
        <div className="taste-match-container">
            {/* Animated Match Percentage Ring */}
            <div className="match-ring-wrapper">
                <svg className="match-ring" width="180" height="180">
                    {/* Background circle */}
                    <circle
                        cx="90"
                        cy="90"
                        r={radius}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="12"
                        fill="transparent"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="90"
                        cy="90"
                        r={radius}
                        stroke="url(#matchGradient)"
                        strokeWidth="12"
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="progress-ring"
                    />
                    <defs>
                        <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6a11cb" />
                            <stop offset="50%" stopColor="#2575fc" />
                            <stop offset="100%" stopColor="#00f260" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="match-percent-text">
                    <span className="percent-value">{matchPercent}</span>
                    <span className="percent-symbol">%</span>
                    <span className="match-label">Match</span>
                </div>
            </div>

            {/* Genre Overlap Bars */}
            {sharedGenres && sharedGenres.length > 0 && (
                <div className="genre-overlap-section">
                    <h4>Genre Overlap</h4>
                    <div className="genre-bars">
                        {sharedGenres.slice(0, 5).map((genre, index) => (
                            <div key={genre.genre} className="genre-bar-item" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="genre-bar-header">
                                    <span className="genre-name">{genre.genre}</span>
                                    <span className="genre-percent">{genre.matchPercent}%</span>
                                </div>
                                <div className="genre-bar-track">
                                    <div
                                        className="genre-bar-fill"
                                        style={{ width: `${genre.matchPercent}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Shared Authors */}
            {sharedAuthors && sharedAuthors.length > 0 && (
                <div className="shared-authors-section">
                    <h4>Favorite Authors You Both Love</h4>
                    <div className="author-badges">
                        {sharedAuthors.slice(0, 6).map((author, index) => (
                            <span
                                key={author.name}
                                className="author-badge"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <i className="fa-solid fa-feather-pointed"></i>
                                {author.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
        .taste-match-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          padding: 20px;
        }

        .match-ring-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .match-ring {
          transform: rotate(-90deg);
        }

        .progress-ring {
          transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1);
          animation: ringPulse 2s ease-in-out infinite;
        }

        @keyframes ringPulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(106, 17, 203, 0.5)); }
          50% { filter: drop-shadow(0 0 20px rgba(0, 242, 96, 0.6)); }
        }

        .match-percent-text {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .percent-value {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #6a11cb, #2575fc, #00f260);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .percent-symbol {
          font-size: 1.2rem;
          color: var(--text-muted);
          margin-left: 2px;
        }

        .match-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-top: 5px;
        }

        .genre-overlap-section,
        .shared-authors-section {
          width: 100%;
          max-width: 400px;
        }

        .genre-overlap-section h4,
        .shared-authors-section h4 {
          font-size: 0.9rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 15px;
          text-align: center;
        }

        .genre-bars {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .genre-bar-item {
          animation: slideInRight 0.5s ease-out backwards;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .genre-bar-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }

        .genre-name {
          font-size: 0.85rem;
          color: var(--text-main);
        }

        .genre-percent {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .genre-bar-track {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .genre-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6a11cb, #2575fc);
          border-radius: 3px;
          transition: width 1s ease-out;
        }

        .author-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .author-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          font-size: 0.85rem;
          color: var(--text-main);
          animation: fadeInUp 0.5s ease-out backwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .author-badge i {
          color: #ff0099;
          font-size: 0.8rem;
        }
      `}</style>
        </div>
    );
};

export default TasteMatch;
