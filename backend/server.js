require('dotenv').config();
const express = require('express');
const cors = require('cors');
const line = require('@line/bot-sdk');
const db = require('./database.js'); // Import database connection

// LINE Bot SDK configuration
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // for parsing application/json

// API endpoint for sending a reservation notification and saving it
app.post('/api/notify-reservation', (req, res) => {
  const { userId, userName, date } = req.body;

  if (!userId || !userName || !date) {
    return res.status(400).json({ error: 'userId, userName, and date are required' });
  }

  // 1. Send LINE Notification
  const message = {
    type: 'text',
    text: `${userName}様\n以下の日程で予約がクリックされました：\n${date}`,
  };

  client.pushMessage(userId, message)
    .then(() => {
      console.log(`Notification sent to ${userId} for date ${date}`);
      
      // 2. Save to database
      const insertSql = 'INSERT INTO reservations (user_id, user_name, reservation_date) VALUES (?,?,?)';
      db.run(insertSql, [userId, userName, date], function(err) {
        if (err) {
          console.error('Error saving reservation to DB:', err.message);
          // We still return success to the client since the notification was sent
          res.status(200).json({ success: true, message: 'Notification sent, but failed to save reservation.' });
        } else {
          console.log(`Reservation for ${userName} on ${date} saved with ID: ${this.lastID}`);
          res.status(200).json({ success: true, message: 'Notification sent and reservation saved.' });
        }
      });
    })
    .catch((err) => {
      console.error('Error sending LINE notification:', err.originalError ? err.originalError.response.data : err);
      res.status(500).json({ success: false, error: 'Failed to send notification' });
    });
});

// API endpoint for fetching dashboard data
app.get('/api/dashboard-data', (req, res) => {
  const selectSql = "SELECT * FROM reservations ORDER BY timestamp DESC";
  db.all(selectSql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching dashboard data:', err.message);
      res.status(500).json({ success: false, error: 'Failed to fetch data' });
    } else {
      res.status(200).json({ success: true, data: rows });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
