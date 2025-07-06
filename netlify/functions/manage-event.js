import fs from 'fs';
const EVENTS_FILE = '/tmp/events.json';

function loadEvents() {
  if (fs.existsSync(EVENTS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
    } catch {
      return [];
    }
  }
  return [];
}

function saveEvents(events) {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events));
}

export async function handler(event) {
  const secret = event.headers['x-admin-secret'];
  if (secret !== process.env.ADMIN_SECRET) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  let events = loadEvents();

  if (event.httpMethod === 'POST') {
    const data = JSON.parse(event.body || '{}');
    const id = Date.now().toString();
    events.push({ id, ...data });
    saveEvents(events);
    return { statusCode: 200, body: JSON.stringify({ id }) };
  }

  if (event.httpMethod === 'PUT') {
    const data = JSON.parse(event.body || '{}');
    const existing = events.find(e => e.id === data.id);
    if (!existing) {
      return { statusCode: 404, body: 'Event not found' };
    }
    Object.assign(existing, data);
    saveEvents(events);
    return { statusCode: 200, body: JSON.stringify(existing) };
  }

  if (event.httpMethod === 'GET') {
    return { statusCode: 200, body: JSON.stringify(events) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
}
