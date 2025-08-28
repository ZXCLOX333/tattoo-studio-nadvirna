// Простий API для додавання відгуків
// В реальному проекті тут була б база даних

export async function handler(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // POST /api/reviews
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { text, stars = 5, avatar } = body;

      if (!text || text.trim().length === 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false,
            message: 'Text is required' 
          })
        };
      }

      // В реальному проекті тут було б збереження в базу даних
      const newReview = {
        id: Date.now(),
        text: text.trim(),
        rating: stars,
        photo: avatar || "https://api.builder.io/api/v1/image/assets/TEMP/50539832474100cc93c13a30455d91939b986e3b?width=124",
        createdAt: new Date().toISOString()
      };

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ 
          success: true,
          review: newReview,
          message: 'Review added successfully'
        })
      };
    } catch (error) {
      console.error('Error adding review:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false,
          message: 'Internal server error' 
        })
      };
    }
  }

  // Default response
  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
}
