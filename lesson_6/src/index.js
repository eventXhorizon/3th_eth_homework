import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Connect from "./Connect";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const connect = ReactDOM.createRoot(document.getElementById('connect'))
connect.render(
    <Connect/>
)