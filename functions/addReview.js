import fs from "fs";
import path from "path";

const reviewsFile = path.join("/tmp", "reviews.json");

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { photo, text, rating } = JSON.parse(event.body);

    if (!text || !rating) {
      return { statusCode: 400, body: "Missing fields" };
    }

    // Читаємо існуючі відгуки
    let reviews = [];
    if (fs.existsSync(reviewsFile)) {
      reviews = JSON.parse(fs.readFileSync(reviewsFile, "utf-8"));
    }

    // Новий відгук
    const newReview = {
      id: Date.now(),
      photo: photo || null,
      text,
      rating: Number(rating),
    };

    reviews.push(newReview);

    // Зберігаємо
    fs.writeFileSync(reviewsFile, JSON.stringify(reviews));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, review: newReview }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
