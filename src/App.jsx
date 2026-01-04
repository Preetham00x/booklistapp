import React, { useState } from 'react';
import Header from './components/Header';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import './App.css';

function App() {
  const [books, setBooks] = useState([
    {
      title: 'The Martian',
      author: 'Andy Weir',
      isbn: '978-0-553-41802-6',
    },
    
  ]);

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
