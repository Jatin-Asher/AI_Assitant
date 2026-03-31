const MAX_HISTORY_MESSAGES = 8;
const MAX_MESSAGE_LENGTH = 2000;

const ACTION_PROMPTS = {
  guide: [
    "Use a Socratic teaching style.",
    "Help the student reason step by step instead of giving the final answer.",
  ],
  hint: [
    "Give one compact hint only.",
    "Do not reveal the full solution.",
  ],
  stuck: [
    "Assume the student feels blocked.",
    "Break the task into the smallest useful next step.",
  ],
  question: [
    "Reply with 1 or 2 guiding questions that diagnose the student's understanding.",
    "Add one small prompt for what to try next.",
  ],
};

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

const clampText = (value, maxLength = MAX_MESSAGE_LENGTH) =>
  normalizeText(value).slice(0, maxLength);

const normalizeHistory = (history = []) =>
  history
    .filter((item) => item && (item.role === "assistant" || item.role === "user"))
    .slice(-MAX_HISTORY_MESSAGES)
    .map((item) => ({
      role: item.role,
      content: clampText(item.content),
    }))
    .filter((item) => item.content);

const buildSystemInstruction = ({ subject, action }) => {
  const actionPrompts = ACTION_PROMPTS[action] || ACTION_PROMPTS.guide;

  return [
    "You are Socratic AI Tutor, a supportive study coach for students.",
    `The current subject is ${subject}.`,
    "Default to teaching through guided reasoning, reflection, and short hints.",
    "Do not provide the final answer unless the student explicitly asks for a full solution after several guided turns.",
    "Keep the tone warm, calm, and concise.",
    "When useful, follow this shape:",
    "1. Acknowledge the student's current thinking in one short sentence.",
    "2. Ask 1 or 2 guiding questions.",
    "3. Offer one concrete next step or hint.",
    "4. Keep the response under 140 words.",
    ...actionPrompts,
  ].join(" ");
};

const buildStudentPrompt = ({ subject, action, message }) => {
  const normalizedMessage = clampText(message) || `Help me study ${subject}.`;

  if (action === "hint") {
    return `The student wants a hint in ${subject}. Problem or question: ${normalizedMessage}`;
  }

  if (action === "stuck") {
    return `The student is stuck in ${subject}. Problem or question: ${normalizedMessage}`;
  }

  if (action === "question") {
    return `The student wants a guiding question in ${subject}. Topic or problem: ${normalizedMessage}`;
  }

  return `The student is studying ${subject}. Their message is: ${normalizedMessage}`;
};

exports.createTutorMessages = ({ subject, message, history, action }) => {
  const normalizedSubject = normalizeText(subject) || "General Study";
  const normalizedAction = ACTION_PROMPTS[action] ? action : "guide";
  const normalizedHistory = normalizeHistory(history);

  return [
    {
      role: "system",
      content: buildSystemInstruction({
        subject: normalizedSubject,
        action: normalizedAction,
      }),
    },
    ...normalizedHistory.map((item) => ({
      role: item.role,
      content: item.content,
    })),
    {
      role: "user",
      content: buildStudentPrompt({
        subject: normalizedSubject,
        action: normalizedAction,
        message,
      }),
    },
  ];
};
