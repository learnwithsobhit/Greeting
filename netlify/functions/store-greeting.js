const { MongoClient } = require('mongodb');
const MONGODB_URI = process.env.MONGODB_URI;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let client;
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('diwali-greetings');
    const collection = db.collection('messages');

    const { name, timestamp, userAgent } = JSON.parse(event.body);
    const deviceType = /Mobile/.test(userAgent) ? '📱 Mobile' : '💻 Desktop';
    const date = new Date(timestamp);

    // Store message in MongoDB
    const messageDoc = {
      name,
      timestamp: date,
      deviceType,
      userAgent,
      createdAt: new Date()
    };
    await collection.insertOne(messageDoc);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Greeting stored successfully', data: messageDoc })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to store greeting' })
    };
  } finally {
    if (client) {
      await client.close();
    }
  }
}; 