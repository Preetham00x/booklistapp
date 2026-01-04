import React from 'react';

const BookList = ({ books, deleteBook }) => {
    if (books.length === 0) {
        return (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                <i className="fa-solid fa-book" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}></i>
                <p>No books available. Add one above!</p>
            </div>
        )
    }

    return (
        <div className="book-grid">
            {books.map((book) => (
                <div className="book-card" key={book.isbn}>
                    <div className="book-icon">
                        <i className="fa-solid fa-book"></i>
                    </div>
                    <button
                        className="delete-btn"
                        onClick={() => deleteBook(book.isbn)}
                        title="Delete Book"
                    >
                        <i className="fa-solid fa-trash"></i>
                    </button>
                    <div className="book-info">
                        <h3>{book.title}</h3>
                        <p><i className="fa-regular fa-user" style={{ marginRight: '8px' }}></i>{book.author}</p>
                        <span className="isbn-badge">ISBN: {book.isbn}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookList;
