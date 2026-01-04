import React from 'react';

const Header = () => {
    return (
        <div className="header">
            <h1>
                <i className="fa-solid fa-book-open"></i>
                MyBookList
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your book collection</p>
        </div>
    );
};

export default Header;
