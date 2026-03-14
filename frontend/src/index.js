import React from 'react';
import ReactDOM from 'react-dom/client';
import { CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './index.scss';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CustomProvider>
      <App />
    </CustomProvider>
  </React.StrictMode>
);
