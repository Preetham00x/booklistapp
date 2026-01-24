import React from "react";

const BookList = ({ books, onDelete, onToggleFavorite, viewMode = 'grid' }) => {
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

    // List View Layout
    if (viewMode === 'list') {
        return (
            <div className="book-list">
                {books.map((book, index) => (
                    <div
                        key={book.isbn}
                        className="book-list-item glass-panel"
                        style={{ '--delay': `${index * 0.05}s` }}
                    >
                        <div
                            className="list-item-cover"
                            style={{
                                background: book.coverUrl ? 'transparent' : getGradient(book.title),
                                overflow: 'hidden'
                            }}
                        >
                            {book.coverUrl ? (
                                <img
                                    src={book.coverUrl}
                                    alt={book.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentNode.style.background = getGradient(book.title);
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                            ) : null}
                            <span
                                className="list-cover-title"
                                style={{ display: book.coverUrl ? 'none' : 'flex' }}
                            >
                                {book.title.charAt(0)}
                            </span>
                        </div>
                        <div className="list-item-info">
                            <h3 className="list-item-title">{book.title}</h3>
                            <p className="list-item-author">by {book.author}</p>
                            <span className="list-item-isbn">#{book.isbn}</span>
                        </div>
                        <div className="list-item-actions">
                            <button
                                className={`list-fav-btn ${book.isFavorite ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleFavorite(book.isbn);
                                }}
                                title={book.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                <i className={`${book.isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                            </button>
                            <button
                                className="list-delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(book.isbn);
                                }}
                                title="Delete book"
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Grid View Layout (default)
    return (
        <div className="book-grid">
            {books.map((book) => (
                <div key={book.isbn} className="book-card glass-panel" style={{ '--delay': `${Math.random() * 0.5}s` }}>
                    <div
                        className="book-cover"
                        style={{
                            background: book.coverUrl ? 'transparent' : getGradient(book.title)
                        }}
                    >
                        {book.coverUrl ? (
                            <img
                                src={book.coverUrl}
                                alt={book.title}
                                className="cover-image"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                        ) : null}
                        <span
                            className="cover-title"
                            style={{ display: book.coverUrl ? 'none' : 'block' }}
                        >
                            {book.title}
                        </span>
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

