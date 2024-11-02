const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

exports.handler = async function(event, context) {
  try {
    const query = event.queryStringParameters.query || 'krishna || shiva';
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${query}&count=1`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageUrl: data[0].urls.regular,
        photographer: data[0].user.name,
      })
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch photo',
        message: error.message 
      })
    };
  }
}; 