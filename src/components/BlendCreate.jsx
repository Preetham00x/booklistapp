import React, { useState } from 'react';
import { generateInviteCode } from '../utils/blendUtils';

const BlendCreate = ({ onClose, onCreate, onJoin, user }) => {
    const [mode, setMode] = useState('create'); // 'create' or 'join'
    const [blendName, setBlendName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleCreate = () => {
        if (!blendName.trim()) {
            setError('Please enter a name for your blend');
            return;
        }

        const code = generateInviteCode();
        setGeneratedCode(code);
        onCreate({
            name: blendName.trim(),
            inviteCode: code,
            creatorId: user?.uid || 'guest',
            creatorName: user?.displayName || 'Guest User'
        });
    };

    const handleJoin = () => {
        if (!inviteCode.trim() || inviteCode.length !== 6) {
            setError('Please enter a valid 6-character invite code');
            return;
        }

        onJoin(inviteCode.toUpperCase());
    };

    const copyToClipboard = () => {
        const link = `${window.location.origin}?blend=${generatedCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="blend-create-overlay" onClick={onClose}>
            <div className="blend-create-modal glass-panel" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="blend-create-header">
                    <div className="blend-icon">
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                    </div>
                    <h2>Book Blend</h2>
                    <p>Create or join a blend to discover shared reading tastes</p>
                </div>

                {/* Mode Toggle */}
                <div className="mode-toggle">
                    <button
                        className={`toggle-btn ${mode === 'create' ? 'active' : ''}`}
                        onClick={() => { setMode('create'); setError(''); }}
                    >
                        Create New
                    </button>
                    <button
                        className={`toggle-btn ${mode === 'join' ? 'active' : ''}`}
                        onClick={() => { setMode('join'); setError(''); }}
                    >
                        Join Blend
                    </button>
                </div>

                {/* Create Mode */}
                {mode === 'create' && !generatedCode && (
                    <div className="create-form">
                        <div className="input-group">
                            <label>Blend Name</label>
                            <input
                                type="text"
                                className="blend-input"
                                placeholder="e.g., Book Club Blend"
                                value={blendName}
                                onChange={(e) => setBlendName(e.target.value)}
                                maxLength={30}
                            />
                        </div>
                        <button className="btn-gradient create-blend-btn" onClick={handleCreate}>
                            <i className="fa-solid fa-sparkles"></i>
                            Create Blend
                        </button>
                    </div>
                )}

                {/* Generated Code Display */}
                {mode === 'create' && generatedCode && (
                    <div className="code-display">
                        <p className="success-text">
                            <i className="fa-solid fa-circle-check"></i>
                            Blend Created!
                        </p>
                        <div className="invite-code-box">
                            <span className="code">{generatedCode}</span>
                        </div>
                        <button className="copy-link-btn" onClick={copyToClipboard}>
                            <i className={`fa-solid ${copied ? 'fa-check' : 'fa-link'}`}></i>
                            {copied ? 'Copied!' : 'Copy Invite Link'}
                        </button>
                        <p className="hint-text">Share this code with friends to blend your reading tastes!</p>
                    </div>
                )}

                {/* Join Mode */}
                {mode === 'join' && (
                    <div className="join-form">
                        <div className="input-group">
                            <label>Enter Invite Code</label>
                            <input
                                type="text"
                                className="blend-input code-input"
                                placeholder="ABC123"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                maxLength={6}
                            />
                        </div>
                        <button className="btn-gradient join-blend-btn" onClick={handleJoin}>
                            <i className="fa-solid fa-user-plus"></i>
                            Join Blend
                        </button>
                    </div>
                )}

                {error && <p className="error-text">{error}</p>}

                <style>{`
          .blend-create-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            animation: fadeIn 0.2s ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .blend-create-modal {
            width: 100%;
            max-width: 420px;
            padding: 40px;
            position: relative;
            animation: slideUp 0.3s ease-out;
          }

          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }

          .close-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: transparent;
            border: none;
            color: var(--text-muted);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all 0.2s;
          }

          .close-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
          }

          .blend-create-header {
            text-align: center;
            margin-bottom: 30px;
          }

          .blend-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 1.5rem;
            color: white;
            box-shadow: 0 10px 30px rgba(106, 17, 203, 0.4);
          }

          .blend-create-header h2 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 8px;
          }

          .blend-create-header p {
            color: var(--text-muted);
            font-size: 0.9rem;
          }

          .mode-toggle {
            display: flex;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            padding: 4px;
            margin-bottom: 25px;
          }

          .toggle-btn {
            flex: 1;
            padding: 10px;
            background: transparent;
            border: none;
            color: var(--text-muted);
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            border-radius: 10px;
            transition: all 0.2s;
          }

          .toggle-btn.active {
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            color: white;
          }

          .create-form,
          .join-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .input-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .input-group label {
            font-size: 0.85rem;
            color: var(--text-muted);
            font-weight: 500;
          }

          .blend-input {
            padding: 14px 18px;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: white;
            font-size: 1rem;
            outline: none;
            transition: all 0.2s;
          }

          .blend-input:focus {
            border-color: #6a11cb;
            box-shadow: 0 0 0 2px rgba(106, 17, 203, 0.2);
          }

          .blend-input::placeholder {
            color: rgba(255, 255, 255, 0.3);
          }

          .code-input {
            text-align: center;
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: 8px;
            text-transform: uppercase;
          }

          .create-blend-btn,
          .join-blend-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 14px;
            font-size: 1rem;
          }

          .code-display {
            text-align: center;
          }

          .success-text {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: #00f260;
            margin-bottom: 20px;
            font-weight: 500;
          }

          .invite-code-box {
            background: rgba(0, 0, 0, 0.3);
            border: 2px dashed rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
          }

          .invite-code-box .code {
            font-size: 2rem;
            font-weight: 800;
            letter-spacing: 8px;
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .copy-link-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            color: white;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 15px;
          }

          .copy-link-btn:hover {
            background: rgba(255, 255, 255, 0.15);
          }

          .hint-text {
            font-size: 0.8rem;
            color: var(--text-muted);
          }

          .error-text {
            text-align: center;
            color: #ff416c;
            font-size: 0.9rem;
            margin-top: 15px;
          }
        `}</style>
            </div>
        </div>
    );
};

export default BlendCreate;
