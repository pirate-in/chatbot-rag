
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatInterface from './ChatInterface';
//import ChatApplication  from './ChatApplication';
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChatInterface />
  </React.StrictMode>,
);