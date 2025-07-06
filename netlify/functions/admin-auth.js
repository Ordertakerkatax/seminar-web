export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { password } = JSON.parse(event.body || '{}');
  if (password === process.env.ADMIN_SECRET) {
    return { statusCode: 200, body: JSON.stringify({ authorized: true }) };
  }
  return { statusCode: 401, body: JSON.stringify({ authorized: false }) };
}
