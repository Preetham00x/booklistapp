import React, { useState } from "react";

const BookForm = ({ onAddBook }) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [isbn, setIsbn] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !author || !isbn) {
            // Basic validation, though parent handles notifications usually
            return;
        }
        onAddBook({ title, author, isbn });
        setTitle("");
        setAuthor("");
        setIsbn("");
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
                <button type="submit" className="btn-gradient" style={{ marginTop: '10px' }}>
                    Add Book
                </button>
            </form>
        </div>
    );
};

export default BookForm;
