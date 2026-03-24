import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // In a real app, store the token securely
        localStorage.setItem('authToken', data.token);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="terminal-header">
        <h1>ZTALK SECURE TERMINAL</h1>
        <div className="status-indicator">[ ENCRYPTION STATUS: ACTIVE ]</div>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        
        <div className="input-group">
          <label>USERNAME:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="terminal-input"
            required
          />
        </div>

        <div className="input-group">
          <label>PASSWORD:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="terminal-input"
            required
          />
        </div>

        <button type="submit" className="terminal-button">
          &gt; AUTHENTICATE
        </button>
      </form>

      <div className="terminal-footer">
        <p>© 2026 ZTALK SECURE COMMUNICATIONS</p>
      </div>
    </div>
  );
};

export default Login;