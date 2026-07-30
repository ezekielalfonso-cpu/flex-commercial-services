import { getBookingStore } from './booking-store.js';

const allowedEvents = new Set(['attempt', 'success']);

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(body),
});

const parseBody = (event) => {
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch {
    return {};
  }
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const body = parseBody(event);
  const eventName = typeof body.event === 'string' ? body.event : '';

  if (!allowedEvents.has(eventName)) {
    return json(400, { error: 'Invalid booking event.' });
  }

  const store = getBookingStore();
  const timestamp = new Date().toISOString();
  const key = `${eventName}/${timestamp}-${crypto.randomUUID()}.json`;

  await store.setJSON(key, {
    event: eventName,
    createdAt: timestamp,
    path: event.headers.referer || '',
    userAgent: event.headers['user-agent'] || '',
  });

  return json(200, { ok: true });
};
