import { useState, useEffect } from "react";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";
import Modal from "./components/Modal";
import Login from "./components/Login";
import HistoryList from "./components/HistoryList";
import BlendPage from "./components/BlendPage";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./App.css";

// Firebase
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Sidebar = ({ currentView, setView, user, isGuest, onLogout, onLoginRedirect }) => (
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
      <div
        className={`nav-item ${currentView === 'blend' ? 'active' : ''}`}
        onClick={() => setView('blend')}
      >
        <i className="fa-solid fa-wand-magic-sparkles"></i>
        <span>Book Blend</span>
      </div>
    </nav>

    <ThemeToggle />

    {user ? (
      <div className="user-profile">
        <div className="avatar">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="avatar-img" />
          ) : (
            <i className="fa-solid fa-user"></i>
          )}
        </div>
        <div className="user-info">
          <span className="name">{user.displayName || user.email}</span>
          <span className="role" onClick={onLogout} style={{ cursor: 'pointer', color: 'var(--purple-light)' }}>
            Sign Out
          </span>
        </div>
      </div>
    ) : (
      <div className="user-profile">
        <div className="avatar" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <i className="fa-solid fa-user-secret"></i>
        </div>
        <div className="user-info">
          <span className="name">Guest User</span>
          <span className="role" onClick={onLogout} style={{ cursor: 'pointer', color: 'var(--purple-primary)' }}>
            Sign In
          </span>
        </div>
      </div>
    )}
  </aside>
);

function AppContent() {
  // --- STATE ---
  const [user, setUser] = useState(null); // Firebase User Object
  const [isGuest, setIsGuest] = useState(false); // Guest Mode State
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');

  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("books");
    return savedBooks ? JSON.parse(savedBooks) : [];
  });

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [notification, setNotification] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // --- PERSISTENCE EFFECT ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsGuest(false); // If they log in, they are no longer a guest
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

  const handleLogout = async () => {
    if (isGuest) {
      setIsGuest(false); // Just reset guest state to show login
      showNotification("Ready to Sign In");
    } else {
      try {
        await signOut(auth);
        setCurrentView('home');
        showNotification("Logged out successfully");
      } catch (error) {
        console.error(error);
        showNotification("Error logging out", "error");
      }
    }
  };

  const handleGuestLogin = () => {
    setIsGuest(true);
    showNotification("Welcome, Guest!");
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

  const updateBook = (updatedBook) => {
    setBooks(books.map(book =>
      book.isbn === updatedBook.isbn ? { ...book, ...updatedBook } : book
    ));
    setEditingBook(null);
    showNotification("Book Updated Successfully");
    addToHistory(`Updated "${updatedBook.title}"`, 'update');
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  // --- RENDER HELPERS ---
  const getFilteredBooks = () => {
    if (currentView === 'favorites') {
      return books.filter(b => b.isFavorite);
    }
    return books;
  };

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // If not logged in AND not a guest, show Login Screen
  if (!user && !isGuest) {
    return (
      <div className="app-container">
        <Login onGuestLogin={handleGuestLogin} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar
        currentView={currentView}
        setView={setCurrentView}
        user={user}
        isGuest={isGuest}
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
              {currentView === 'blend' && 'Book Blend'}
            </h2>

            {currentView !== 'history' && currentView !== 'blend' && (
              <div className="view-options">
                <i
                  className={`fa-solid fa-list ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                ></i>
                <i
                  className={`fa-solid fa-border-all ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                ></i>
              </div>
            )}
          </div>

          {currentView === 'history' ? (
            <HistoryList history={history} clearHistory={clearHistory} />
          ) : currentView === 'blend' ? (
            <BlendPage user={user} isGuest={isGuest} books={books} />
          ) : (
            <BookList
              books={getFilteredBooks()}
              onDelete={deleteBook}
              onToggleFavorite={toggleFavorite}
              onEditBook={handleEditBook}
              viewMode={viewMode}
            />
          )}
        </div>
      </main>

      {(isModalOpen || editingBook) && (
        <Modal onClose={closeModal}>
          <BookForm
            onAddBook={addBook}
            editBook={editingBook}
            onUpdateBook={updateBook}
            onClose={closeModal}
          />
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

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
