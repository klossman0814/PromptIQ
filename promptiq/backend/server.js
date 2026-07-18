const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5176;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/generate', async (req, res) => {
  const { task } = req.body;

  if (!task || !task.trim()) {
    return res.status(400).json({ error: 'Task is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a prompt engineering expert. Your job is to take a user's task description and generate a highly effective prompt for an AI coding agent (such as opencode, Claude Code, or similar). The prompt should be clear, structured, and actionable.

Generate a prompt with the following structure:
- A clear statement of the agent's role
- The task broken down in a detailed, step-oriented way
- Specific instructions on how to approach the work
- Constraints and guidelines
- Expected output format

Write the prompt in plain text, ready to copy-paste. Do NOT wrap it in markdown code fences or add extra commentary.`,
        },
        {
          role: 'user',
          content: `Generate an AI agent prompt for the following task:\n\n${task.trim()}`,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const prompt = completion.choices[0].message.content.trim();
    res.json({ prompt });
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || 'Failed to generate prompt';
    res.status(status).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`PromptIQ backend running on port ${PORT}`);
});
