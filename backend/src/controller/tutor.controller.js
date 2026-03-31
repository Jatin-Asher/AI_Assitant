const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_TRANSCRIPTION_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
const { createTutorMessages } = require('../services/socraticTutor.service.js');

exports.chatWithTutor = async (req, res) => {
  const { subject, message, history = [], action = 'guide' } = req.body || {};

  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required.' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ message: 'Missing GROQ_API_KEY on the server.' });
  }

  const messages = createTutorMessages({ subject, message, history, action });

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 240,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const quotaExceeded = response.status === 429;
      return res.status(response.status).json({
        message: quotaExceeded
          ? 'Groq quota exceeded for this API key. Check billing or rate limits and try again later.'
          : data?.error?.message || 'Groq request failed.',
      });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(500).json({ message: 'No tutor reply was generated.' });
    }

    return res.json({ reply });
  } catch (error) {
    return res.status(500).json({
      message: 'Tutor request failed.',
      error: error.message,
    });
  }
};

exports.transcribeAudio = async (req, res) => {
  const { audioBase64, mimeType = 'audio/webm' } = req.body || {};

  if (!audioBase64) {
    return res.status(400).json({ message: 'Audio data is required.' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ message: 'Missing GROQ_API_KEY on the server.' });
  }

  try {
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const extension = mimeType.includes('mp4')
      ? 'm4a'
      : mimeType.includes('ogg')
        ? 'ogg'
        : mimeType.includes('wav')
          ? 'wav'
          : 'webm';

    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer], { type: mimeType }), `voice-input.${extension}`);
    formData.append('model', 'whisper-large-v3-turbo');
    formData.append('language', 'en');
    formData.append('response_format', 'verbose_json');

    const response = await fetch(GROQ_TRANSCRIPTION_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: data?.error?.message || 'Groq transcription request failed.',
      });
    }

    const transcript = data?.text?.trim();

    if (!transcript) {
      return res.status(500).json({ message: 'No transcript was generated.' });
    }

    return res.json({ transcript });
  } catch (error) {
    return res.status(500).json({
      message: 'Audio transcription failed.',
      error: error.message,
    });
  }
};
