
// export default App
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Summarizer from './summarizer'; // Import Summarizer component
import NewsDisplay from './NewsDisplay'; // Import NewsDisplay component

const App = () => {
  // Toggle between summarizer and news display
  const [showSummarizer, setShowSummarizer] = useState(true);

  return (
    <>
      <div className="col text-center mb-5 bg-success">
        <h1 className="display-4" style={{ color: 'white' }}>Nepali News Summarizer</h1>
      </div>
      <div className="container">
        <div className="mb-3">
          <button className="btn btn-primary me-2" onClick={() => setShowSummarizer(true)}>Summarizer</button>
          <button className="btn btn-primary" onClick={() => setShowSummarizer(false)}>News Display</button>
        </div>

        {showSummarizer ? (
          <Summarizer />
        ) : (
          <NewsDisplay />
        )}
      </div>
    </>
  );
};

export default App;