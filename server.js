const express = require('express');
const bodyParser = require('body-parser');
const webPush = require('web-push');

const app = express();
app.use(bodyParser.json());

const vapidKeys = {
  publicKey: 'BGLl57u4N2WGsSPjuxNRrKohFf68iznS3PsmU3OZYXn-6WJlSNaMCvli5tGAIVZsgfNt8H0vjueU2NZ__ka3CjE',
  privateKey: 'EYGujmoPJkhJFjKOA-LhfLf-G15rvWUxH4WpXyh1awM'
};

webPush.setVapidDetails(
  'mailto:hello@mumbaiwebsiteagency.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let savedSubscription = null;

app.post('/save-subscription', (req, res) => {
  savedSubscription = req.body;
  res.status(201).json({ message: 'Subscription saved' });
});

app.post('/send-notification', (req, res) => {
  const payload = JSON.stringify({
    title: 'New Lead!',
    body: 'You have a new inquiry on MWA site.',
    url: 'https://mumbaiwebsiteagency.com/contact'
  });

  webPush.sendNotification(savedSubscription, payload)
    .then(() => res.status(200).json({ message: 'Push sent' }))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.listen(3000, () => console.log('Push server running on http://localhost:3000'));
