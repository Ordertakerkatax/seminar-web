const events = require('./events.json');

exports.handler = async function(event) {
  const id = event.queryStringParameters && event.queryStringParameters.id;
  if (id) {
    const found = events.find(e => e.id === id);
    if (!found) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Event not found' }) };
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(found)
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(events)
  };
};
