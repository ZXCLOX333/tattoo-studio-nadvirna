import { getStore } from "@netlify/blobs";

export async function handler() {
  try {
    const store = getStore("reviews");
    const data = (await store.get("all")) || "[]";
    const reviews = JSON.parse(data);

    let averageRating = 0;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      averageRating = (sum / reviews.length).toFixed(1);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reviews, averageRating }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
