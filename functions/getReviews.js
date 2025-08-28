// Прості відгуки для демонстрації
const reviews = [
  {
    id: 1,
    text: "Дякую, милуюсь, дуже подобається 😍",
    rating: 5,
    photo: "https://api.builder.io/api/v1/image/assets/TEMP/cdb95157596678dcd21a38073c5dcce3c7845536?width=124"
  },
  {
    id: 2,
    text: "Плівочку зняла, трошки ще шкіра відшулушується але все чудово, всі звертають увагу на це тату, тільки ходжу і компліменти збираю, відгук зроблю коли вже повністю заживе, мені дуууже подобається що вийшло",
    rating: 5,
    photo: "https://api.builder.io/api/v1/image/assets/TEMP/cdb95157596678dcd21a38073c5dcce3c7845536?width=124"
  },
  {
    id: 3,
    text: "Дуже дякую вам за таку красу🥰",
    rating: 5,
    photo: "https://api.builder.io/api/v1/image/assets/TEMP/50539832474100cc93c13a30455d91939b986e3b?width=124"
  },
  {
    id: 4,
    text: "Дякую вам велике, дійсно передали почерк татка",
    rating: 5,
    photo: "https://api.builder.io/api/v1/image/assets/TEMP/2729787a24c3ce7f2d8e56cf9df4a559357dd1cc?width=124"
  },
  {
    id: 5,
    text: "В мене всі в восторзі перекриттям😍😍😍",
    rating: 5,
    photo: "https://api.builder.io/api/v1/image/assets/TEMP/4f321696851b976b89571c1e7b153c95b21343cd?width=124"
  },
  {
    id: 6,
    text: "Щиро дякую я цілий вечір ними любуюсь",
    rating: 5,
    photo: "https://api.builder.io/api/v1/image/assets/TEMP/0acf3d9092acdfa26325861372ef538be625cfbb?width=124"
  },
  {
    id: 7,
    text: "Робила у вас своє перше довгоочікуване татуювання, від результату я просто в захваті. Заживше тату виглядає неймовірно. Буду вас рекомендувати своїм друзям і знайомим і вернусь за другим тату",
    rating: 5,
    photo: "https://api.builder.io/api/v1/image/assets/TEMP/0acf3d9092acdfa26325861372ef538be625cfbb?width=124"
  },
  {
    id: 8,
    text: "🔥",
    rating: 5,
    photo: "https://api.builder.io/api/v1/image/assets/TEMP/a1e30bb9c104bd25e0eb8a67f857180939b05fb1?width=124"
  },
  {
    id: 9,
    text: "Дуже дякую за атмосферу і професіоналізм!",
    rating: 5,
    photo: "https://api.builder.io/api/v1/image/assets/TEMP/50539832474100cc93c13a30455d91939b986e3b?width=124"
  },
  {
    id: 10,
    text: "Все дуже сподобалось, прийду ще!",
    rating: 5,
    photo: "https://api.builder.io/api/v1/image/assets/TEMP/2729787a24c3ce7f2d8e56cf9df4a559357dd1cc?width=124"
  }
];

// Розрахунок середнього рейтингу
const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

export async function handler(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // GET /api/reviews
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        reviews,
        averageRating: Math.round(averageRating * 10) / 10
      })
    };
  }

  // Default response
  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
}
