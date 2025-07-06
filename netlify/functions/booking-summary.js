import fs from 'fs';
const BOOKINGS_FILE = '/tmp/bookings.json';

function loadBookings() {
  if (fs.existsSync(BOOKINGS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'));
    } catch {
      return [];
    }
  }
  return [];
}

export async function handler(event) {
  const secret = event.headers['x-admin-secret'];
  if (secret !== process.env.ADMIN_SECRET) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const bookings = loadBookings();
  return {
    statusCode: 200,
    body: JSON.stringify({ count: bookings.length, bookings })
  };
}
