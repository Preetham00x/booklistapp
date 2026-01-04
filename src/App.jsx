import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
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

  // Save books to localStorage whenever books state changes
  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const addBook = (book) => {
    setBooks([...books, book]);
  };

  const deleteBook = (isbn) => {
    setBooks(books.filter((book) => book.isbn !== isbn));
  };

  return (
    <div className="app-container">
      <Header />
      <BookForm addBook={addBook} />
      <BookList books={books} deleteBook={deleteBook} />
    </div>
  );
}

export default App;
