import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', role: 'ADMIN', status: 'ACTIVE' },
    { id: 2, username: 'john', role: 'OPERATOR', status: 'ACTIVE' },
    { id: 3, username: 'maria', role: 'OPERATOR', status: 'ACTIVE' }
  ]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'OPERATOR' });
  const [units, setUnits] = useState(['Alpha Unit', 'Bravo Unit', 'Operations Unit']);
  const [newUnit, setNewUnit] = useState('');
  const [channels, setChannels] = useState(['ALPHA-OPS', 'BRAVO-OPS', 'COMMAND']);
  const [newChannel, setNewChannel] = useState('');
  const [logs, setLogs] = useState([
    { timestamp: '2026-03-07 22:45', event: 'User "john" created', by: 'admin' },
    { timestamp: '2026-03-07 22:48', event: 'Channel "ALPHA-OPS" created', by: 'admin' },
    { timestamp: '2026-03-07 22:50', event: 'User "maria" connected', by: 'system' }
  ]);

  useEffect(() => {
    // In a real app, fetch admin data from the API
    // For now, using static data
  }, []);

  const handleCreateUser = () => {
    if (newUser.username && newUser.password) {
      setUsers([...users, { 
        id: users.length + 1, 
        ...newUser,
        status: 'ACTIVE'
      }]);
      setNewUser({ username: '', password: '', role: 'OPERATOR' });
      
      // Add to audit logs
      setLogs([...logs, {
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        event: `User "${newUser.username}" created`,
        by: 'admin'
      }]);
    }
  };

  const handleCreateUnit = () => {
    if (newUnit) {
      setUnits([...units, newUnit]);
      setNewUnit('');
      
      // Add to audit logs
      setLogs([...logs, {
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        event: `Unit "${newUnit}" created`,
        by: 'admin'
      }]);
    }
  };

  const handleCreateChannel = () => {
    if (newChannel) {
      setChannels([...channels, newChannel]);
      setNewChannel('');
      
      // Add to audit logs
      setLogs([...logs, {
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        event: `Channel "${newChannel}" created`,
        by: 'admin'
      }]);
    }
  };

  const handleLogout = () => {
    // In a real app, invalidate the token
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <div className="terminal-header">
        <h1>ADMIN COMMAND CENTER</h1>
        <div className="status-indicator">[ ADMIN MODE ACTIVE ]</div>
      </div>

      <div className="main-content">
        <div className="left-panel">
          <h2>USER MANAGEMENT</h2>
          
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={e => setNewUser({...newUser, username: e.target.value})}
              className="terminal-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={e => setNewUser({...newUser, password: e.target.value})}
              className="terminal-input"
            />
            <select
              value={newUser.role}
              onChange={e => setNewUser({...newUser, role: e.target.value})}
              className="terminal-input"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="OPERATOR">OPERATOR</option>
              <option value="OBSERVER">OBSERVER</option>
            </select>
            <button className="terminal-button" onClick={handleCreateUser}>
              CREATE USER
            </button>
          </div>

          <div className="admin-list">
            {users.map(user => (
              <div key={user.id} className="admin-item">
                <span>{user.username} ({user.role})</span>
                <span className={`status-badge ${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="center-panel">
          <h2>UNIT & CHANNEL MANAGEMENT</h2>
          
          <div className="form-group">
            <input
              type="text"
              placeholder="New Unit Name"
              value={newUnit}
              onChange={e => setNewUnit(e.target.value)}
              className="terminal-input"
            />
            <button className="terminal-button" onClick={handleCreateUnit}>
              CREATE UNIT
            </button>
          </div>

          <div className="admin-list">
            {units.map((unit, index) => (
              <div key={index} className="admin-item">
                <span>{unit}</span>
              </div>
            ))}
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="New Channel Name"
              value={newChannel}
              onChange={e => setNewChannel(e.target.value)}
              className="terminal-input"
            />
            <button className="terminal-button" onClick={handleCreateChannel}>
              CREATE CHANNEL
            </button>
          </div>

          <div className="admin-list">
            {channels.map((channel, index) => (
              <div key={index} className="admin-item">
                <span>{channel}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="right-panel">
          <h2>AUDIT LOGS</h2>
          
          <div className="log-container">
            {logs.map((log, index) => (
              <div key={index} className="log-entry">
                <span className="log-timestamp">[{log.timestamp}]</span>
                <span className="log-event">{log.event}</span>
                <span className="log-by">by {log.by}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="terminal-footer">
        <button className="terminal-button" onClick={handleLogout}>
          LOGOUT
        </button>
        <p>© 2026 ZTALK SECURE COMMUNICATIONS</p>
      </div>
    </div>
  );
};

export default AdminDashboard;