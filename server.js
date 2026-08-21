const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Connection error:", err));

// Message Schema
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Contact form route
app.post('/api/contact', async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.status(200).json({ success: true, message: "Message saved!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin route - get all messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Simple admin auth middleware
const ADMIN_PASSWORD = "muqadas123"; // aap ye change kar sakti hain

app.post('/api/admin-login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));