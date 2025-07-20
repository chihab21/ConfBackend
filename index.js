require('dotenv').config();  // add this at the top

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});


app.get("/", (req, res) => {
  res.json({ msg: "Hello chihab" });
});

app.post('/send-response', async (req, res) => {
  const { type, message, name } = req.body;

  let subject = '';
  let text = '';

  if (type === 'yes') {
    subject = `💕 Yes response from ${name || 'Someone'}`;
    text = `${name || 'Someone'} said YES 💖`;
  } else if (type === 'no') {
    subject = `💔 No response from ${name || 'Someone'}`;
    text = `${name || 'Someone'} said NO 🙁`;
  } else if (type === 'message') {
    subject = `📩 Message from ${name || 'Someone'}`;
    text = message || '(No message provided)';
  } else {
    return res.status(400).json({ error: 'Invalid type' });
  }

  const mailOptions = {
    from: 'chihabghlala49@gmail.com',
    to: 'chihabghlala49@gmail.com',
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.json({ success: true, info });
  } catch (error) {
    console.error('Error sending mail:', error);
    res.status(500).json({ success: false, error: error.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
