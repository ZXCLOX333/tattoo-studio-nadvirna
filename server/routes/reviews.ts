import { RequestHandler } from "express";
import { Review, ReviewsResponse, AddReviewRequest, AddReviewResponse } from "@shared/api";

// Store reviews in memory (for serverless functions)
let reviews: Review[] = [];

// Helper function to read reviews from memory
async function readReviews(): Promise<Review[]> {
  return reviews;
}

// Helper function to write reviews to memory
async function writeReviews(newReviews: Review[]): Promise<void> {
  reviews = newReviews;
}

// GET /api/reviews - Get all reviews
export const getReviews: RequestHandler = async (req, res) => {
  try {
    const reviews = await readReviews();
    const response: ReviewsResponse = { reviews };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error reading reviews:", error);
    res.status(500).json({ error: "Failed to read reviews" });
  }
};

// POST /api/reviews - Add new review
export const addReview: RequestHandler = async (req, res) => {
  try {
    const { text, avatar, stars }: AddReviewRequest = req.body;
    
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required and cannot be empty" });
    }

    const reviews = await readReviews();
    
    const newReview: Review = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      avatar: avatar || "https://api.builder.io/api/v1/image/assets/TEMP/50539832474100cc93c13a30455d91939b986e3b?width=124",
      stars: stars || 5,
    };

    reviews.push(newReview);
    await writeReviews(reviews);

    const response: AddReviewResponse = { review: newReview };
    res.status(201).json(response);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
};

// DELETE /api/reviews - Clear all reviews
export const clearReviews: RequestHandler = async (req, res) => {
  try {
    await writeReviews([]);
    res.status(200).json({ message: "All reviews cleared successfully" });
  } catch (error) {
    console.error("Error clearing reviews:", error);
    res.status(500).json({ error: "Failed to clear reviews" });
  }
};
