import { getStore } from '@netlify/blobs';

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(body),
});

const countPrefix = async (store, prefix) => {
  let count = 0;
  let cursor;

  do {
    const page = await store.list({ prefix, cursor });
    count += page.blobs.length;
    cursor = page.cursor;
  } while (cursor);

  return count;
};

export const handler = async (event) => {
  const configuredToken = process.env.BOOKING_STATS_TOKEN;
  const providedToken = event.queryStringParameters?.token || '';

  if (!configuredToken || providedToken !== configuredToken) {
    return json(401, { error: 'Unauthorized' });
  }

  const store = getStore('booking-submission-events');
  const attempts = await countPrefix(store, 'attempt/');
  const successes = await countPrefix(store, 'success/');

  return json(200, {
    attempts,
    successes,
    possibleFailures: Math.max(attempts - successes, 0),
  });
};
