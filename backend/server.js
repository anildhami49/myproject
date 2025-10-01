// ...existing code...
// Get all bookings (correct placement)
// ...existing code...
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userdb', { useNewUrlParser: true, useUnifiedTopology: true });

// Nodemailer for sending emails
const nodemailer = require('nodemailer');

// User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String
});
const User = mongoose.model('User', userSchema);

// Get user info by username (for frontend to fetch email after login)
app.get('/userinfo', async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ message: 'Username required' });
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ username: user.username, email: user.email });
});

// Booking schema
const bookingSchema = new mongoose.Schema({
  username: String, // or userId if you have it
  pickup: String,
  drop: String,
  date: String,
  time: String,
  email: String
});
const Booking = mongoose.model('Booking', bookingSchema);

// Booking route
app.post('/book', async (req, res) => {
  const { username, pickup, drop, date, time, email } = req.body;

  // Prevent booking in the past
  const bookingDateTime = new Date(`${date}T${time}`);
  const now = new Date();
  if (bookingDateTime < now) {
    return res.status(400).json({ message: 'Cannot book a ride in the past.' });
  }

  try {
    const booking = new Booking({ username, pickup, drop, date, time, email });
    await booking.save();

    // Send confirmation email
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'anildhami49@gmail.com', // replace with your email
        pass: 'anil@1234'     // replace with your app password
      }
    });

    let mailOptions = {
      from: 'anildhami49@gmail.com',
      to: email,
      subject: 'Booking Confirmation',
      text: `Your booking from ${pickup} to ${drop} on ${date} at ${time} is confirmed!`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.json({ message: 'Booking saved and confirmation email sent!' });
  } catch (err) {
    res.status(500).json({ message: 'Booking failed.' });
  }
});

// Signup route
app.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;
  const user = new User({ username, password, email });
  await user.save();
  res.json({ message: 'User registered successfully!' });
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.json({ message: 'Login successful!' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

app.get('/', (req, res) => {
  res.send('Welcome Your Backend Server is running!');
});

// ...existing code...