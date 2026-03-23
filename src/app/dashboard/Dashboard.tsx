import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../services/websocket';
import RadioChannel from '../radio/RadioChannel';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { messages, isConnected, sendMessage } = useWebSocket();
  const [inputMessage, setInputMessage] = useState('');

  const handleSend = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="terminal-header">
        <h1>ZTALK SECURE COMMUNICATIONS</h1>
        <div className="status-indicator">
          [ ENCRYPTION VERIFIED ] | {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
        </div>
      </div>

      <div className="main-content">
        <div className="left-panel">
          <h2>UNITS</h2>
          <ul className="unit-list">
            <li className="unit-item">Alpha Unit</li>
            <li className="unit-item">Bravo Unit</li>
            <li className="unit-item">Operations Unit</li>
          </ul>
        </div>

        <div className="center-panel">
          <RadioChannel />
        </div>

        <div className="right-panel">
          <h2>OPERATORS</h2>
          <ul className="operator-list">
            <li className="operator-item">John (Online)</li>
            <li className="operator-item">Maria (Online)</li>
            <li className="operator-item">Alex (Transmitting)</li>
          </ul>
        </div>
      </div>

      <div className="terminal-footer">
        <button className="terminal-button" onClick={() => navigate('/login')}>
          LOGOUT
        </button>
        <p>© 2026 ZTALK SECURE COMMUNICATIONS</p>
      </div>
    </div>
  );
};

export default Dashboard;
