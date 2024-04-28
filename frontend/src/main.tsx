import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AppProvider } from './providers/AppProvider.tsx';
import { System } from './system/System.tsx';

ReactDOM.createRoot(document.getElementById('system')!).render(<System />);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider />
  </React.StrictMode>,
);
