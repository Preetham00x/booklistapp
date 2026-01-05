import { useState, useEffect } from "react";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";
import Modal from "./components/Modal";
import Login from "./components/Login";
import HistoryList from "./components/HistoryList";
import "./App.css";

const Sidebar = ({ currentView, setView, user, onLogout }) => (
  <aside className="sidebar glass-panel">
    <div className="logo">
      <i className="fa-solid fa-book-open"></i>
      <span>BookList</span>
    </div>

    <nav className="nav-menu">
      <div
        className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
        onClick={() => setView('home')}
      >
        <i className="fa-solid fa-house"></i>
        <span>Home</span>
      </div>
      <div
        className={`nav-item ${currentView === 'library' ? 'active' : ''}`}
        onClick={() => setView('library')}
      >
        <i className="fa-solid fa-layer-group"></i>
        <span>Library</span>
      </div>
      <div
        className={`nav-item ${currentView === 'favorites' ? 'active' : ''}`}
        onClick={() => setView('favorites')}
      >
        <i className="fa-solid fa-heart"></i>
        <span>Favorites</span>
      </div>
      <div
        className={`nav-item ${currentView === 'history' ? 'active' : ''}`}
        onClick={() => setView('history')}
      >
        <i className="fa-solid fa-clock-rotate-left"></i>
        <span>History</span>
      </div>
    </nav>

    {user && (
      <div className="user-profile">
        <div className="avatar">
          <i className="fa-solid fa-user"></i>
        </div>
        <div className="user-info">
          <span className="name">{user.name}</span>
          <span className="role" onClick={onLogout} style={{ cursor: 'pointer', color: '#ff416c' }}>
            Sign Out
          </span>
        </div>
      </div>
    )}
  </aside>
);

function App() {
  // --- STATE ---
  const [user, setUser] = useState(null); // Auth State
  const [currentView, setCurrentView] = useState('home'); // Navigation: home, library, favorites, history

  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("books");
    return savedBooks ? JSON.parse(savedBooks) : [];
  });

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  // --- ACTIONS ---
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToHistory = (message, type = 'info') => {
    const newAction = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString()
    };
    setHistory([newAction, ...history]);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    showNotification(`Welcome back, ${userData.name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
    showNotification("Logged out successfully");
  };

  const addBook = (book) => {
    const newBook = { ...book, isFavorite: false };
    setBooks([...books, newBook]);
    setIsModalOpen(false);
    showNotification("Book Added Successfully");
    addToHistory(`Added "${book.title}" to library`, 'add');
  };

  const deleteBook = (isbn) => {
    const bookToDelete = books.find(b => b.isbn === isbn);
    setBooks(books.filter((book) => book.isbn !== isbn));
    showNotification("Book Removed", "error");
    if (bookToDelete) {
      addToHistory(`Removed "${bookToDelete.title}"`, 'delete');
    }
  };

  const toggleFavorite = (isbn) => {
    setBooks(books.map(book => {
      if (book.isbn === isbn) {
        const newStatus = !book.isFavorite;
        addToHistory(
          `${newStatus ? 'Added' : 'Removed'} "${book.title}" ${newStatus ? 'to' : 'from'} favorites`,
          'favorite'
        );
        return { ...book, isFavorite: newStatus };
      }
      return book;
    }));
  };

  const clearHistory = () => {
    setHistory([]);
    showNotification("History Cleared");
  };

  // --- RENDER HELPERS ---
  const getFilteredBooks = () => {
    if (currentView === 'favorites') {
      return books.filter(b => b.isFavorite);
    }
    return books;
  };

  // If not logged in, show Login Screen
  if (!user) {
    return (
      <div className="app-container">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar
        currentView={currentView}
        setView={setCurrentView}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <header className="top-bar glass-panel">
          <div className="search-bar">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Search books, authors..." className="search-input" />
          </div>
          <button className="btn-gradient" onClick={() => setIsModalOpen(true)}>
            <i className="fa-solid fa-plus"></i> New Book
          </button>
        </header>

        <div className="content-area">
          <div className="section-header">
            <h2>
              {currentView === 'home' && 'Home'}
              {currentView === 'library' && 'My Library'}
              {currentView === 'favorites' && 'Favorites'}
              {currentView === 'history' && 'Activity History'}
            </h2>

            {currentView !== 'history' && (
              <div className="view-options">
                <i className="fa-solid fa-list"></i>
                <i className="fa-solid fa-border-all active"></i>
              </div>
            )}
          </div>

          {currentView === 'history' ? (
            <HistoryList history={history} clearHistory={clearHistory} />
          ) : (
            <BookList
              books={getFilteredBooks()}
              onDelete={deleteBook}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </div>
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <BookForm onAddBook={addBook} />
        </Modal>
      )}

      {notification && (
        <div className={`notification glass-panel ${notification.type}`}>
          {notification.type === "success" ? (
            <i className="fa-solid fa-circle-check"></i>
          ) : (
            <i className="fa-solid fa-circle-exclamation"></i>
          )}
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default App;
