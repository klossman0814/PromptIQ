import React, { useState } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [prompt, setPrompt] = useState('');

  const generatePrompt = () => {
    if (!task.trim()) return;

    const p = `You are an AI agent tasked with the following objective:

## Task
${task.trim()}

## Instructions
- Analyze the task carefully and break it down into clear steps.
- Use the tools and capabilities available to you to complete the task.
- Verify your work at each step before proceeding to the next.
- If you encounter errors, diagnose and fix them before continuing.
- Provide clear reasoning for each action you take.
- When the task is complete, summarize what was done and the results.

## Constraints
- Do not make assumptions beyond what is stated in the task.
- If requirements are ambiguous, ask for clarification or state your assumptions.
- Follow security best practices (do not expose secrets, keys, or sensitive data).
- Only make changes that are directly relevant to the task.

## Output
- Provide a final summary of all actions taken and the outcome.
- Include any relevant file paths, commands run, or configuration changes.`;

    setPrompt(p);
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
            <button className="btn btn-primary" onClick={generatePrompt} disabled={!task.trim()}>
              Generate Prompt
            </button>
            <button className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
          </div>
        </section>

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
