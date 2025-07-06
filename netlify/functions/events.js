const path = require('path');

// Load events data from the data directory
const events = require(path.join(__dirname, '../data/events.json'));

exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify(events)
  };
};
