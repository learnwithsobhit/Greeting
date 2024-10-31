const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { name, timestamp, userAgent } = JSON.parse(event.body);

    const deviceType = /Mobile/.test(userAgent) ? '📱 Mobile' : '💻 Desktop';
    const date = new Date(timestamp);

    const message = `
🪔 *New Diwali Greeting!* 🪔

*Visitor Name:* ${name}
*Time:* ${date.toLocaleTimeString()}
*Date:* ${date.toLocaleDateString()}
*Device:* ${deviceType}
`;

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notification sent successfully', data })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send notification' })
    };
  }
}; 