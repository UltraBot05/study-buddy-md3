import React from 'react';
import { isDemoMode } from '../services/aiService';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1 className="header-title">AI Study Assistant</h1>
      {isDemoMode && (
        <div className="demo-badge" title="Demo mode is active - responses are simulated">
          Demo Mode
        </div>
      )}
    </header>
  );
};

export default Header;