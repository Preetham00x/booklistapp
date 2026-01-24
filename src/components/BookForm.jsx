import React, { useState } from "react";
import { GENRES } from "../utils/blendUtils";

const BookForm = ({ onAddBook }) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [isbn, setIsbn] = useState("");
    const [genre, setGenre] = useState([]);
    const [rating, setRating] = useState(0);
    const [readDate, setReadDate] = useState("");
    const [showGenreDropdown, setShowGenreDropdown] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !author || !isbn) {
            return;
        }
        onAddBook({
            title,
            author,
            isbn,
            genre: genre.length > 0 ? genre : null,
            rating: rating > 0 ? rating : null,
            readDate: readDate || null
        });
        setTitle("");
        setAuthor("");
        setIsbn("");
        setGenre([]);
        setRating(0);
        setReadDate("");
    };

    const toggleGenre = (g) => {
        if (genre.includes(g)) {
            setGenre(genre.filter(item => item !== g));
        } else if (genre.length < 3) {
            setGenre([...genre, g]);
        }
    };

    return (
        <div className="form-container">
            <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Add New Book</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                    <input
                        type="text"
                        className="glass-input"
                        placeholder="Book Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        className="glass-input"
                        placeholder="Author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        className="glass-input"
                        placeholder="ISBN #"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        required
                    />
                </div>

                {/* Genre Selection */}
                <div className="form-group genre-group">
                    <label className="form-label">Genre (select up to 3)</label>
                    <div
                        className="genre-selector glass-input"
                        onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                    >
                        {genre.length > 0 ? (
                            <div className="selected-genres">
                                {genre.map(g => (
                                    <span key={g} className="genre-tag">
                                        {g}
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); toggleGenre(g); }}
                                        >×</button>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="placeholder">Select genres...</span>
                        )}
                        <i className={`fa-solid fa-chevron-${showGenreDropdown ? 'up' : 'down'}`}></i>
                    </div>
                    {showGenreDropdown && (
                        <div className="genre-dropdown glass-panel">
                            {GENRES.map(g => (
                                <div
                                    key={g}
                                    className={`genre-option ${genre.includes(g) ? 'selected' : ''}`}
                                    onClick={() => toggleGenre(g)}
                                >
                                    <span>{g}</span>
                                    {genre.includes(g) && <i className="fa-solid fa-check"></i>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Star Rating */}
                <div className="form-group">
                    <label className="form-label">Rating</label>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                className={`star-btn ${rating >= star ? 'active' : ''}`}
                                onClick={() => setRating(rating === star ? 0 : star)}
                            >
                                <i className={`${rating >= star ? 'fa-solid' : 'fa-regular'} fa-star`}></i>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Read Date */}
                <div className="form-group">
                    <label className="form-label">Date Read (optional)</label>
                    <input
                        type="date"
                        className="glass-input"
                        value={readDate}
                        onChange={(e) => setReadDate(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn-gradient" style={{ marginTop: '10px' }}>
                    Add Book
                </button>
            </form>

            <style>{`
                .form-label {
                    display: block;
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    margin-bottom: 8px;
                }

                .genre-group {
                    position: relative;
                }

                .genre-selector {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    min-height: 48px;
                }

                .genre-selector .placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }

                .selected-genres {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .genre-tag {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    padding: 4px 10px;
                    background: linear-gradient(135deg, rgba(106, 17, 203, 0.3), rgba(37, 117, 252, 0.3));
                    border-radius: 15px;
                    font-size: 0.8rem;
                }

                .genre-tag button {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 0;
                    font-size: 1rem;
                    line-height: 1;
                }

                .genre-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 100;
                    margin-top: 5px;
                    padding: 8px 0;
                }

                .genre-option {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 15px;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .genre-option:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .genre-option.selected {
                    background: rgba(106, 17, 203, 0.2);
                    color: #6a11cb;
                }

                .genre-option.selected i {
                    color: #6a11cb;
                }

                .star-rating {
                    display: flex;
                    gap: 8px;
                }

                .star-btn {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: rgba(255, 255, 255, 0.3);
                    cursor: pointer;
                    padding: 5px;
                    transition: all 0.2s;
                }

                .star-btn:hover {
                    transform: scale(1.2);
                }

                .star-btn.active {
                    color: #ffc107;
                }

                .star-btn.active i {
                    filter: drop-shadow(0 0 5px rgba(255, 193, 7, 0.5));
                }

                input[type="date"] {
                    color-scheme: dark;
                }
            `}</style>
        </div>
    );
};

export default BookForm;

