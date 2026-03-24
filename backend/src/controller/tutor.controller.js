const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_TRANSCRIPTION_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

const buildActionPrompt = (action, message, subject) => {
  const normalizedMessage = message?.trim() || `Help me study ${subject}.`;

  switch (action) {
    case 'hint':
      return `The student is studying ${subject}. Give a hint for this problem without solving it directly: ${normalizedMessage}`;
    case 'stuck':
      return `The student says they are stuck in ${subject}. Break the problem into a smaller next step and ask one helpful guiding question: ${normalizedMessage}`;
    case 'question':
      return `The student wants a diagnostic question in ${subject}. Ask a smart follow-up question that helps them think through this: ${normalizedMessage}`;
    default:
      return `The student is studying ${subject}. Respond to this message with guidance, not the final answer: ${normalizedMessage}`;
  }
};

exports.chatWithTutor = async (req, res) => {
  const { subject, message, history = [], action = 'guide' } = req.body || {};

  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required.' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ message: 'Missing GROQ_API_KEY on the server.' });
  }

  const systemInstruction = [
    'You are Socratic AI Tutor, a chat-based learning assistant for students.',
    'Never give the final answer directly unless the student explicitly asks for the full solution after several guided turns.',
    'Prefer guiding questions, short hints, and next-step prompts.',
    'Adapt to the student reply and keep the tone supportive, clear, and concise.',
    'For each reply, do these when appropriate:',
    '1. Acknowledge the student thought in one short sentence.',
    '2. Ask 1 or 2 guiding questions.',
    '3. Offer one small hint or next step.',
    '4. Keep the reply under 140 words.',
  ].join(' ');

  const contents = [
    ...history.slice(-8).map((item) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content }],
    })),
    {
      role: 'user',
      parts: [{ text: buildActionPrompt(action, message, subject) }],
    },
  ];

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
        messages: [
          {
            role: 'system',
            content: systemInstruction,
          },
          ...contents.map((item) => ({
            role: item.role === 'model' ? 'assistant' : item.role,
            content: item.parts.map((part) => part.text || '').join('\n'),
          })),
        ],
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
