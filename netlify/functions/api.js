// Простий тестовий API для Netlify Functions
export async function handler(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const { path, httpMethod } = event;
  const pathSegments = path.split('/').filter(Boolean);

  try {
    // API routes
    if (pathSegments[1] === 'api') {
      const endpoint = pathSegments[2];

      // GET /api/ping
      if (endpoint === 'ping' && httpMethod === 'GET') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'ping' })
        };
      }

      // GET /api/demo
      if (endpoint === 'demo' && httpMethod === 'GET') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Hello from Netlify Functions! 🚀' })
        };
      }

      // GET /api/reviews
      if (endpoint === 'reviews' && httpMethod === 'GET') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ reviews: [] })
        };
      }

      // POST /api/reviews
      if (endpoint === 'reviews' && httpMethod === 'POST') {
        const body = JSON.parse(event.body || '{}');
        const { text } = body;

        if (!text || text.trim().length === 0) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Text is required' })
          };
        }

        const newReview = {
          id: Date.now(),
          text: text.trim(),
          createdAt: new Date().toISOString()
        };

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ review: newReview })
        };
      }

      // POST /api/contact
      if (endpoint === 'contact' && httpMethod === 'POST') {
        const body = JSON.parse(event.body || '{}');
        const { name, phone, message } = body;

        console.log('Contact form data:', { name, phone, message });

        if (!name || !phone || !message) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ 
              success: false, 
              message: "Всі поля обов'язкові" 
            })
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: "Повідомлення успішно надіслано!"
          })
        };
      }
    }

    // Default response
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };

  } catch (error) {
    console.error('API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}
