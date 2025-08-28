// Netlify Functions handler type
type Handler = (event: any, context: any) => Promise<any>;

// Просте зберігання в пам'яті (для демонстрації)
let reviews: any[] = [];
let reviewId = 1;

// Telegram налаштування
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Функція для відправки в Telegram
async function sendToTelegram(data: { name: string; phone: string; message: string }) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Telegram credentials not set');
    return false;
  }

  try {
    const message = `
🔔 *Нове повідомлення з сайту*

👤 *Ім'я:* ${data.name}
📱 *Телефон:* ${data.phone}
💬 *Повідомлення:* ${data.message}

⏰ *Час:* ${new Date().toLocaleString('uk-UA')}
    `;

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Telegram error:', error);
    return false;
  }
}

export const handler: Handler = async (event, context) => {
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
          body: JSON.stringify({ message: 'Hello from Express server' })
        };
      }

      // GET /api/reviews
      if (endpoint === 'reviews' && httpMethod === 'GET') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ reviews })
        };
      }

      // POST /api/reviews
      if (endpoint === 'reviews' && httpMethod === 'POST') {
        const body = JSON.parse(event.body || '{}');
        const { text, avatar, stars } = body;

        if (!text || text.trim().length === 0) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Text is required' })
          };
        }

        const newReview = {
          id: reviewId++,
          text: text.trim(),
          avatar: avatar || 'https://api.builder.io/api/v1/image/assets/TEMP/50539832474100cc93c13a30455d91939b986e3b?width=124',
          stars: stars || 5,
          createdAt: new Date().toISOString()
        };

        reviews.push(newReview);

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

        if (name.trim().length === 0 || phone.trim().length === 0 || message.trim().length === 0) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ 
              success: false, 
              message: "Всі поля повинні бути заповнені" 
            })
          };
        }

        const success = await sendToTelegram({ name, phone, message });

        if (success) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: "Повідомлення успішно надіслано!"
            })
          };
        } else {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
              success: false,
              message: "Помилка відправки повідомлення. Спробуйте пізніше."
            })
          };
        }
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
};
