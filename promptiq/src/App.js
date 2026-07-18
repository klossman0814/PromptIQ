import React, { useState } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || '/api';

function App() {
  const [task, setTask] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generatePrompt = async () => {
    if (!task.trim()) return;
    setLoading(true);
    setError('');
    setPrompt('');

    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: task.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate prompt');
      setPrompt(data.prompt);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  };

  const handleClear = () => {
    setTask('');
    setPrompt('');
    setError('');
  };

  return (
    <div className="container">
      <header>
        <h1>PromptIQ</h1>
        <p className="subtitle">Turn any task into a precise AI agent prompt</p>
      </header>

      <main>
        <section className="input-section">
          <label htmlFor="task-input">What do you want your AI agent to do?</label>
          <textarea
            id="task-input"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="e.g., Create a Python script that monitors a directory for new CSV files and uploads them to an S3 bucket..."
            rows={6}
          />
          <div className="actions">
            <button className="btn btn-primary" onClick={generatePrompt} disabled={!task.trim() || loading}>
              {loading ? 'Generating...' : 'Generate Prompt'}
            </button>
            <button className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
          </div>
        </section>

        {error && (
          <section className="output-section">
            <div className="error-box">{error}</div>
          </section>
        )}

        {prompt && (
          <section className="output-section">
            <div className="output-header">
              <h2>Generated Prompt</h2>
              <button className="btn btn-copy" onClick={handleCopy}>
                Copy to Clipboard
              </button>
            </div>
            <pre className="prompt-output">{prompt}</pre>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
