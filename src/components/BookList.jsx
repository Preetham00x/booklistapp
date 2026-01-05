import React from "react";

const BookList = ({ books, onDelete, onToggleFavorite }) => {
    if (books.length === 0) {
        return (
            <div className="empty-state glass-panel">
                <i className="fa-solid fa-book-open-reader"></i>
                <h3>Your library is empty</h3>
                <p>Add some books to get started!</p>
            </div>
        );
    }

    // Function to generate a deterministic gradient based on the book title
    const getGradient = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c1 = Math.floor(Math.abs(Math.sin(hash) * 16777215)).toString(16);
        const c2 = Math.floor(Math.abs(Math.cos(hash) * 16777215)).toString(16);
        return `linear-gradient(135deg, #${c1.padEnd(6, '0')}, #${c2.padEnd(6, '0')})`;
    };

    return (
        <div className="book-grid">
            {books.map((book) => (
                <div key={book.isbn} className="book-card glass-panel" style={{ '--delay': `${Math.random() * 0.5}s` }}>
                    <div className="book-cover" style={{ background: getGradient(book.title) }}>
                        <span className="cover-title">{book.title}</span>
                        <button
                            className={`fav-btn ${book.isFavorite ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(book.isbn);
                            }}
                        >
                            <i className={`${book.isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                        </button>
                    </div>
                    <div className="book-details">
                        <h3 className="book-title">{book.title}</h3>
                        <p className="book-author">by {book.author}</p>
                        <div className="book-meta">
                            <span className="isbn">#{book.isbn}</span>
                            <button
                                className="delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(book.isbn);
                                }}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookList;
