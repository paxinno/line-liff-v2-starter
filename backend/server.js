// server.js（雛形）
const express = require('express');
const app = express();
const port = 3000;

// LINEへのPushメッセージ送信処理（実装例）
require('dotenv').config();
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
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


// LINE Messaging API Webhook
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
