import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import Modal from './components/Modal';
import './App.css';

function App() {
  // Load initial books from localStorage or use empty array
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem('books');
    if (savedBooks) {
      return JSON.parse(savedBooks);
    } else {
      return [];
    }
  });

  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Save books to localStorage whenever books state changes
  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 10000); // 10 seconds
  };

  const addBook = (book) => {
    setBooks([...books, book]);
    setSuccessModalOpen(true);
  };

  const confirmDelete = (isbn) => {
    setBookToDelete(isbn);
    setDeleteModalOpen(true);
  };

  const executeDelete = () => {
    setBooks(books.filter((book) => book.isbn !== bookToDelete));
    setDeleteModalOpen(false);
    setBookToDelete(null);
  };

  return (
    <div className="app-container">
      <Header />

      {/* Validation Alert (keep as banner) */}
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>
          <i className={`fa-solid ${alert.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
          {alert.message}
        </div>
      )}

      {/* Success Modal */}
      <Modal
        isOpen={successModalOpen}
        title="Success"
        actions={
          <button className="btn-primary" onClick={() => setSuccessModalOpen(false)}>
            OK
          </button>
        }
      >
        <div style={{ textAlign: 'center' }}>
          <i className="fa-solid fa-circle-check" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Book Added Successfully!</p>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Confirm Delete"
        actions={
          <>
            <button className="btn-secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-danger" onClick={executeDelete}>
              Delete
            </button>
          </>
        }
      >
        <p>Are you sure you want to remove this book from your list?</p>
      </Modal>

      <BookForm addBook={addBook} showAlert={showAlert} />
      <BookList books={books} deleteBook={confirmDelete} />
    </div>
  );
}

export default App;
