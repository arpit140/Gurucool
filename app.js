const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'nfwjnfri3i';
const RABBITMQ_QUEUE = 'Gurucool';

const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

app.use(bodyParser.json());

// Middleware to authenticate users
const authenticateUser = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Login route to generate JWT token upon successful login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);
  res.json({ token });
});

// Protected route to enqueue a message
app.post('/enqueue', authenticateUser, (req, res) => {
  const { message } = req.body;
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
      throw error0;
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(RABBITMQ_QUEUE, { durable: true });
      channel.sendToQueue(RABBITMQ_QUEUE, Buffer.from(message), { persistent: true });
      console.log(`Message enqueued: ${message}`);
    });
  });

  res.json({ message: 'Message enqueued successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
