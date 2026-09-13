export interface ReviewDto {
  reviewId: string;
  productId: string;
  userId: string;
  userName?: string | null;
  rating: number;
  comment: string;
  imageUrls: string[];
  createdAt: string;
}

export interface CreateReviewCommand {
  productId: string;
  rating: number; // 1 -> 5
  comment: string;
  images?: File[];
}
