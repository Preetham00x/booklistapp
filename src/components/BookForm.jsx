import React, { useState } from 'react';

const BookForm = ({ addBook, showAlert }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [isbn, setIsbn] = useState('');
    const [isShaking, setIsShaking] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title === '' || author === '' || isbn === '') {
            showAlert('Please fill in all fields', 'error');
            // Trigger shake
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500); // Remove class after animation
            return;
        }
        const book = { title, author, isbn };
        addBook(book);
        setTitle('');
        setAuthor('');
        setIsbn('');
    };

    return (
        <div className={`book-form-card ${isShaking ? 'shake' : ''}`}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Add New Book</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        className="form-control"
                        placeholder="Enter book title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input
                        type="text"
                        id="author"
                        className="form-control"
                        placeholder="Enter author name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="isbn">ISBN</label>
                    <input
                        type="text"
                        id="isbn"
                        className="form-control"
                        placeholder="ISBN Number"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn-submit">
                    Add Book <i className="fa-solid fa-plus" style={{ marginLeft: '8px' }}></i>
                </button>
            </form>
        </div>
    );
};

export default BookForm;
