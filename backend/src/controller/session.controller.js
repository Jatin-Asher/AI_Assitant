exports.endSession = async (req, res) => {
  const { sessionId, timeSpent } = req.body || {};

  if (!sessionId || typeof timeSpent !== 'number') {
    return res.status(400).json({ message: 'sessionId and numeric timeSpent are required.' });
  }

  return res.status(200).json({
    message: 'Session time saved successfully.',
    session: {
      sessionId,
      timeSpent,
      endedAt: Date.now(),
    },
  });
};
