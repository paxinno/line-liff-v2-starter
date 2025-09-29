// server.js（雛形）
const express = require('express');
const app = express();
const port = 3000;

// JSONリクエストボディをパースするため
app.use(express.json());

// 通知APIのエンドポイント
app.post('/notify', (req, res) => {
  console.log('Received notification request:', req.body);
  // ここにLINEへの通知処理を実装します
  // const { userId, message } = req.body;
  // pushMessage(userId, message);
  res.status(200).send('Notification request received.');
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});

// LINEへのPushメッセージ送信処理（実装例）
/*
require('dotenv').config();
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};

const client = new line.Client(config);

function pushMessage(userId, message) {
  client.pushMessage(userId, { type: 'text', text: message })
    .then(() => {
      console.log('Message sent successfully!');
    })
    .catch((err) => {
      console.error('Error sending message:', err);
    });
}
*/