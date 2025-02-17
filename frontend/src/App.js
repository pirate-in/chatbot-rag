import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import RAGSystem from './RagSystem';
import GraphFlow from './GraphFlow';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route path="/rag-system" element={<RAGSystem />} />
        <Route path="/graph-flow" element={<GraphFlow />} />
      </Routes>
    </Router>
  );
};

export default App;