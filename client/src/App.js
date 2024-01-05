import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NewsDisplay from './NewsDisplay'; // Import NewsDisplay component

const App = () => {
  return (
    <>
      <div className="col text-center mb-5 bg-success">
        <h1 className="display-4" style={{ color: 'white' }}>Nepali News Summarizer</h1>
      </div>
      <div className="container">
        <NewsDisplay />
      </div>
    </>
  );
};

export default App;