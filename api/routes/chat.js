import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/pf-chat', async (req, res) => {
  try {
    const { chatInput, sessionId } = req.body;

    if (!chatInput) {
      return res.status(422).json({ output: 'Message is required.' });
    }

    // .env yahan read karna zaroori hai - route call hote waqt (module load ke waqt nahi)
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

    const response = await axios.post(
      N8N_WEBHOOK_URL,
      {
        chatInput,
        sessionId: sessionId || `pf_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      },
      { timeout: 30000 }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ output: 'Server error: ' + err.message });
  }
});

export default router;