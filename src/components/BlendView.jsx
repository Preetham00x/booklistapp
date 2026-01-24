import React from 'react';
import TasteMatch from './TasteMatch';
import {
    calculateTasteMatch,
    findSharedGenres,
    findSharedAuthors,
    findSharedBooks,
    generateTasteDescription,
    getBlendGradient,
    getBlendedRecommendations
} from '../utils/blendUtils';

const BlendView = ({ blend, currentUserBooks, otherUserBooks, onBack }) => {
    // Calculate all blend statistics
    const matchPercent = calculateTasteMatch(currentUserBooks, otherUserBooks);
    const sharedGenres = findSharedGenres(currentUserBooks, otherUserBooks);
    const sharedAuthors = findSharedAuthors(currentUserBooks, otherUserBooks);
    const sharedBooks = findSharedBooks(currentUserBooks, otherUserBooks);
    const tasteDescription = generateTasteDescription(sharedGenres);
    const recommendations = getBlendedRecommendations(
        [...currentUserBooks, ...otherUserBooks],
        sharedGenres,
        sharedAuthors
    );

    // Get member names for display
    const memberNames = Object.values(blend.memberNames || {});
    const otherMemberName = memberNames.find(name => name !== blend.currentUserName) || 'Your Friend';

    // Dynamic gradient based on blend members
    const blendGradient = getBlendGradient(
        memberNames[0] || 'user1',
        memberNames[1] || 'user2'
    );

    return (
        <div className="blend-view">
            {/* Header with Back Button */}
            <div className="blend-view-header">
                <button className="back-btn" onClick={onBack}>
                    <i className="fa-solid fa-arrow-left"></i>
                    Back to Blends
                </button>
            </div>

            {/* Hero Section with Gradient */}
            <div className="blend-hero" style={{ background: blendGradient }}>
                <div className="blend-hero-content">
                    <div className="blend-avatars">
                        <div className="avatar-circle">
                            <i className="fa-solid fa-user"></i>
                        </div>
                        <div className="blend-connector">
                            <i className="fa-solid fa-heart"></i>
                        </div>
                        <div className="avatar-circle">
                            <i className="fa-solid fa-user"></i>
                        </div>
                    </div>
                    <h1 className="blend-title">{blend.name || 'Your Blend'}</h1>
                    <p className="blend-members">
                        You & {otherMemberName}
                    </p>
                </div>
            </div>

            {/* Taste Match Section */}
            <div className="blend-section glass-panel">
                <TasteMatch
                    matchPercent={matchPercent}
                    sharedGenres={sharedGenres}
                    sharedAuthors={sharedAuthors}
                />
            </div>

            {/* Taste Description */}
            <div className="taste-description glass-panel">
                <i className="fa-solid fa-quote-left"></i>
                <p>{tasteDescription}</p>
            </div>

            {/* Shared Books Section */}
            {sharedBooks.length > 0 && (
                <div className="blend-section glass-panel">
                    <h3 className="section-title">
                        <i className="fa-solid fa-book"></i>
                        Books You've Both Read
                    </h3>
                    <div className="shared-books-grid">
                        {sharedBooks.map((book, index) => (
                            <div
                                key={book.isbn || index}
                                className="shared-book-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="book-cover-mini" style={{
                                    background: `linear-gradient(135deg, hsl(${(book.title.charCodeAt(0) * 10) % 360}, 70%, 50%), hsl(${(book.title.charCodeAt(1) * 10) % 360}, 60%, 40%))`
                                }}>
                                    <span>{book.title.substring(0, 2).toUpperCase()}</span>
                                </div>
                                <div className="book-info">
                                    <span className="book-title">{book.title}</span>
                                    <span className="book-author">{book.author}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Blended Recommendations */}
            {recommendations.length > 0 && (
                <div className="blend-section glass-panel">
                    <h3 className="section-title">
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                        Recommended for Your Blend
                    </h3>
                    <div className="recommendations-grid">
                        {recommendations.map((book, index) => (
                            <div
                                key={book.isbn || index}
                                className="recommendation-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="rec-cover" style={{
                                    background: `linear-gradient(135deg, hsl(${(book.title.charCodeAt(0) * 15) % 360}, 65%, 45%), hsl(${(book.title.charCodeAt(1) * 15) % 360}, 55%, 35%))`
                                }}>
                                    <span className="rec-title-overlay">{book.title}</span>
                                </div>
                                <div className="rec-details">
                                    <span className="rec-title">{book.title}</span>
                                    <span className="rec-author">by {book.author}</span>
                                    {book.genre && (
                                        <span className="rec-genre">{Array.isArray(book.genre) ? book.genre[0] : book.genre}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {currentUserBooks.length === 0 || otherUserBooks.length === 0 ? (
                <div className="empty-blend-state glass-panel">
                    <i className="fa-solid fa-book-open-reader"></i>
                    <h3>Add More Books!</h3>
                    <p>Both blend members need to add books to see taste matches and recommendations.</p>
                </div>
            ) : null}

            <style>{`
        .blend-view {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-bottom: 40px;
        }

        .blend-view-header {
          margin-bottom: 10px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.9rem;
          cursor: pointer;
          padding: 10px 0;
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: white;
        }

        .blend-hero {
          border-radius: var(--card-radius);
          padding: 50px 30px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .blend-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
        }

        .blend-hero-content {
          position: relative;
          z-index: 1;
        }

        .blend-avatars {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .avatar-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .blend-connector {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 0, 153, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .blend-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 10px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .blend-members {
          font-size: 1rem;
          opacity: 0.9;
        }

        .blend-section {
          padding: 30px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 25px;
        }

        .section-title i {
          color: #ff0099;
        }

        .taste-description {
          padding: 25px 30px;
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .taste-description i {
          color: var(--text-muted);
          font-size: 1.2rem;
          margin-top: 3px;
        }

        .taste-description p {
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--text-main);
        }

        .shared-books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }

        .shared-book-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          animation: fadeInUp 0.5s ease-out backwards;
        }

        .book-cover-mini {
          width: 50px;
          height: 70px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.8);
          flex-shrink: 0;
        }

        .book-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow: hidden;
        }

        .book-info .book-title {
          font-size: 0.9rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .book-info .book-author {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .recommendations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 20px;
        }

        .recommendation-card {
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          animation: fadeInUp 0.5s ease-out backwards;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .recommendation-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .rec-cover {
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px;
          text-align: center;
        }

        .rec-title-overlay {
          font-size: 1rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .rec-details {
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .rec-title {
          font-size: 0.9rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rec-author {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .rec-genre {
          display: inline-block;
          padding: 4px 10px;
          background: rgba(106, 17, 203, 0.2);
          border-radius: 20px;
          font-size: 0.7rem;
          color: #6a11cb;
          margin-top: 5px;
          width: fit-content;
        }

        .empty-blend-state {
          padding: 50px;
          text-align: center;
        }

        .empty-blend-state i {
          font-size: 3rem;
          color: rgba(255, 255, 255, 0.2);
          margin-bottom: 20px;
        }

        .empty-blend-state h3 {
          margin-bottom: 10px;
        }

        .empty-blend-state p {
          color: var(--text-muted);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
};

export default BlendView;
