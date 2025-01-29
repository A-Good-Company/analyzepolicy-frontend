// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('en');
  const [answer, setAnswer] = useState('');
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिन्दी (Hindi)' },
    { value: 'ar', label: 'العربية (Arabic)' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('YOUR_CLOUD_FUNCTION_URL/query', {
        query,
        lang: language
      });

      setAnswer(response.data.answer);
      setSections(response.data.sections);
    } catch (err) {
      setError('Error fetching response. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Policy Document Analyzer</h1>
      </header>

      <div className="search-container">
        <form onSubmit={handleSubmit}>
          <div className="language-selector">
            <label htmlFor="language">Select Language:</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="search-box">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your question..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="results-container">
        {answer && (
          <div className="answer-section">
            <h2>Answer</h2>
            <div className="answer-content" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {answer}
            </div>
          </div>
        )}

        {sections.length > 0 && (
          <div className="sources-section">
            <h2>Relevant Sections</h2>
            {sections.map((section, index) => (
              <div key={index} className="source-card">
                <div className="source-meta">
                  <span className="source-name">{section.source}</span>
                  {section.page && <span className="page-number">Page {section.page}</span>}
                </div>
                <p className="source-text">{section.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;