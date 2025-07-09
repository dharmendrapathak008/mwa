import webpush from 'web-push';

const VAPID_PUBLIC_KEY = 'BGLl57u4N2WGsSPjuxNRrKohFf68iznS3PsmU3OZYXn-6WJlSNaMCvli5tGAIVZsgfNt8H0vjueU2NZ__ka3CjE';
const VAPID_PRIVATE_KEY = 'EYGujmoPJkhJFjKOA-LhfLf-G15rvWUxH4WpXyh1awM';

webpush.setVapidDetails(
  'mailto:you@mumbaiwebsiteagency.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

let savedSubscription = null;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { subscription, title, body, url } = req.body;

    if (subscription) {
      savedSubscription = subscription;
      return res.status(201).json({ message: 'Subscription saved' });
    }

    if (!savedSubscription) {
      return res.status(400).json({ message: 'No subscription saved' });
    }

    const payload = JSON.stringify({
      title: title || 'Default Title',
      body: body || 'Default message',
      url: url || 'https://mumbaiwebsiteagency.com'
    });

    try {
      await webpush.sendNotification(savedSubscription, payload);
      return res.status(200).json({ message: 'Push sent' });
    } catch (err) {
      return res.status(500).json({ message: 'Push failed', error: err.message });
    }
  }

  res.status(405).json({ message: 'Only POST allowed' });
}
