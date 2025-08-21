// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import ClarityPlanner from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import AuthGate from './components/AuthGate.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AuthGate>
        <ClarityPlanner />
      </AuthGate>
    </AuthProvider>
  </React.StrictMode>
);
