import React, { useState, useEffect } from 'react';
import BlendCreate from './BlendCreate';
import BlendView from './BlendView';
import { db } from '../firebase';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    onSnapshot,
    serverTimestamp,
    arrayUnion
} from 'firebase/firestore';
import { calculateTasteMatch, generateInviteCode } from '../utils/blendUtils';

const BlendPage = ({ user, isGuest, books }) => {
    const [blends, setBlends] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [selectedBlend, setSelectedBlend] = useState(null);
    const [otherUserBooks, setOtherUserBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    // For demo purposes, we'll use localStorage for blends when user is guest
    useEffect(() => {
        if (isGuest) {
            const savedBlends = localStorage.getItem('blends');
            setBlends(savedBlends ? JSON.parse(savedBlends) : []);
            setLoading(false);
            return;
        }

        if (!user) {
            setLoading(false);
            return;
        }

        // Listen for real-time blend updates from Firestore
        const blendsRef = collection(db, 'blends');
        const q = query(blendsRef, where('members', 'array-contains', user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const blendData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBlends(blendData);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching blends:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, isGuest]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleCreateBlend = async (blendData) => {
        if (isGuest) {
            // Demo mode - save to localStorage
            const newBlend = {
                id: Date.now().toString(),
                ...blendData,
                members: ['guest'],
                memberNames: { guest: 'Guest User' },
                createdAt: new Date().toISOString(),
                tasteMatch: 0
            };
            const updatedBlends = [...blends, newBlend];
            setBlends(updatedBlends);
            localStorage.setItem('blends', JSON.stringify(updatedBlends));
            showNotification('Blend created! Share the code with friends.');
            return;
        }

        try {
            const newBlend = {
                name: blendData.name,
                inviteCode: blendData.inviteCode,
                members: [user.uid],
                memberNames: { [user.uid]: user.displayName || user.email },
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp(),
                tasteMatch: 0
            };

            await addDoc(collection(db, 'blends'), newBlend);
            showNotification('Blend created! Share the code with friends.');
        } catch (error) {
            console.error('Error creating blend:', error);
            showNotification('Error creating blend', 'error');
        }
    };

    const handleJoinBlend = async (inviteCode) => {
        if (isGuest) {
            showNotification('Sign in to join blends with friends!', 'error');
            setShowCreate(false);
            return;
        }

        try {
            const blendsRef = collection(db, 'blends');
            const q = query(blendsRef, where('inviteCode', '==', inviteCode));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                showNotification('Blend not found. Check the invite code.', 'error');
                return;
            }

            const blendDoc = snapshot.docs[0];
            const blendData = blendDoc.data();

            if (blendData.members.includes(user.uid)) {
                showNotification('You\'re already in this blend!', 'error');
                return;
            }

            await updateDoc(doc(db, 'blends', blendDoc.id), {
                members: arrayUnion(user.uid),
                [`memberNames.${user.uid}`]: user.displayName || user.email,
                lastUpdated: serverTimestamp()
            });

            showNotification('Joined blend successfully!');
            setShowCreate(false);
        } catch (error) {
            console.error('Error joining blend:', error);
            showNotification('Error joining blend', 'error');
        }
    };

    const handleSelectBlend = async (blend) => {
        setSelectedBlend(blend);

        // In a real app, fetch other user's books from Firestore
        // For demo, we'll generate mock data
        if (blend.members && blend.members.length > 1) {
            // Mock other user's books for demo
            const mockOtherBooks = [
                { title: 'The Name of the Wind', author: 'Patrick Rothfuss', genre: ['Fantasy'], rating: 5, isFavorite: true },
                { title: 'Dune', author: 'Frank Herbert', genre: ['Sci-Fi'], rating: 5, isFavorite: true },
                { title: 'The Secret History', author: 'Donna Tartt', genre: ['Dark Academia', 'Literary Fiction'], rating: 4 },
                { title: '1984', author: 'George Orwell', genre: ['Sci-Fi', 'Literary Fiction'], rating: 4 }
            ];
            setOtherUserBooks(mockOtherBooks);
        } else {
            setOtherUserBooks([]);
        }
    };

    // If a blend is selected, show the detailed view
    if (selectedBlend) {
        return (
            <BlendView
                blend={{ ...selectedBlend, currentUserName: user?.displayName || 'You' }}
                currentUserBooks={books}
                otherUserBooks={otherUserBooks}
                onBack={() => setSelectedBlend(null)}
            />
        );
    }

    return (
        <div className="blend-page">
            {/* Header */}
            <div className="blend-page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                    </div>
                    <div>
                        <h2>Book Blend</h2>
                        <p>Discover shared reading tastes with friends</p>
                    </div>
                </div>
                {!isGuest && (
                    <button className="btn-gradient" onClick={() => setShowCreate(true)}>
                        <i className="fa-solid fa-plus"></i>
                        New Blend
                    </button>
                )}
            </div>

            {/* Guest Warning */}
            {isGuest && (
                <div className="guest-warning glass-panel">
                    <i className="fa-solid fa-info-circle"></i>
                    <p>Sign in with Google to create and join blends with friends!</p>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="loading-blends">
                    <div className="loader"></div>
                    <p>Loading your blends...</p>
                </div>
            )}

            {/* Blends Grid */}
            {!loading && blends.length > 0 && (
                <div className="blends-grid">
                    {blends.map((blend, index) => {
                        const memberNames = Object.values(blend.memberNames || {});
                        const tasteMatch = blend.tasteMatch || Math.floor(Math.random() * 40) + 60; // Demo

                        return (
                            <div
                                key={blend.id}
                                className="blend-card glass-panel"
                                onClick={() => handleSelectBlend(blend)}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="blend-card-gradient" style={{
                                    background: `linear-gradient(135deg, hsl(${(blend.name?.charCodeAt(0) * 10) % 360}, 70%, 50%), hsl(${((blend.name?.charCodeAt(1) || 0) * 10) % 360}, 60%, 40%))`
                                }}>
                                    <div className="blend-card-avatars">
                                        <div className="mini-avatar"><i className="fa-solid fa-user"></i></div>
                                        <div className="mini-avatar overlap"><i className="fa-solid fa-user"></i></div>
                                    </div>
                                </div>
                                <div className="blend-card-content">
                                    <h3>{blend.name}</h3>
                                    <p className="blend-members-text">
                                        {memberNames.slice(0, 2).join(' & ')}
                                        {memberNames.length > 2 && ` +${memberNames.length - 2}`}
                                    </p>
                                    <div className="blend-match-preview">
                                        <div className="match-bar">
                                            <div className="match-fill" style={{ width: `${tasteMatch}%` }}></div>
                                        </div>
                                        <span className="match-text">{tasteMatch}% match</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {!loading && blends.length === 0 && (
                <div className="empty-blends glass-panel">
                    <div className="empty-icon">
                        <i className="fa-solid fa-users"></i>
                    </div>
                    <h3>No Blends Yet</h3>
                    <p>Create a blend and invite friends to discover your shared reading tastes!</p>
                    {!isGuest && (
                        <button className="btn-gradient" onClick={() => setShowCreate(true)}>
                            <i className="fa-solid fa-plus"></i>
                            Create Your First Blend
                        </button>
                    )}
                </div>
            )}

            {/* Create/Join Modal */}
            {showCreate && (
                <BlendCreate
                    onClose={() => setShowCreate(false)}
                    onCreate={handleCreateBlend}
                    onJoin={handleJoinBlend}
                    user={user}
                />
            )}

            {/* Notification */}
            {notification && (
                <div className={`blend-notification glass-panel ${notification.type}`}>
                    {notification.type === 'success' ? (
                        <i className="fa-solid fa-circle-check"></i>
                    ) : (
                        <i className="fa-solid fa-circle-exclamation"></i>
                    )}
                    {notification.message}
                </div>
            )}

            <style>{`
        .blend-page {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .blend-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .header-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #6a11cb, #2575fc);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          color: white;
          box-shadow: 0 8px 25px rgba(106, 17, 203, 0.4);
        }

        .blend-page-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .blend-page-header p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .guest-warning {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px 20px;
          background: rgba(255, 153, 0, 0.1);
          border-left: 3px solid #ff9900;
        }

        .guest-warning i {
          color: #ff9900;
        }

        .guest-warning p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .loading-blends {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          gap: 20px;
        }

        .loader {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #6a11cb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .blends-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .blend-card {
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: fadeUp 0.5s ease-out backwards;
        }

        .blend-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .blend-card-gradient {
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .blend-card-avatars {
          display: flex;
          align-items: center;
        }

        .mini-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
        }

        .mini-avatar.overlap {
          margin-left: -15px;
        }

        .blend-card-content {
          padding: 20px;
        }

        .blend-card-content h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .blend-members-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 15px;
        }

        .blend-match-preview {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .match-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .match-fill {
          height: 100%;
          background: linear-gradient(90deg, #6a11cb, #2575fc, #00f260);
          border-radius: 3px;
          transition: width 1s ease-out;
        }

        .match-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .empty-blends {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          text-align: center;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 25px;
        }

        .empty-icon i {
          font-size: 2.5rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .empty-blends h3 {
          font-size: 1.3rem;
          margin-bottom: 10px;
        }

        .empty-blends p {
          color: var(--text-muted);
          margin-bottom: 25px;
          max-width: 300px;
        }

        .blend-notification {
          position: fixed;
          bottom: 30px;
          right: 30px;
          padding: 15px 25px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }

        .blend-notification.success {
          border-left: 4px solid #00f260;
        }

        .blend-notification.error {
          border-left: 4px solid #ff416c;
        }

        .blend-notification.success i {
          color: #00f260;
        }

        .blend-notification.error i {
          color: #ff416c;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
};

export default BlendPage;
