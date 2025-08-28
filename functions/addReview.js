export async function handler(event, context) {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }
  
    try {
      const { photo, text, rating } = JSON.parse(event.body);
  
      if (!text || !rating) {
        return { statusCode: 400, body: "Missing fields" };
      }
  
      const store = context.blobs.getStore("reviews");
  
      const data = (await store.get("all")) || "[]";
      const reviews = JSON.parse(data);
  
      const newReview = {
        id: Date.now(),
        photo: photo || null,
        text,
        rating: Number(rating),
      };
  
      reviews.push(newReview);
  
      await store.set("all", JSON.stringify(reviews));
  
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, review: newReview }),
      };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
  }
  