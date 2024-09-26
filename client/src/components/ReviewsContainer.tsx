import React, { useState } from "react";
import { Recipe, Review, Reply } from "../types";
import Rating from "./Rating";
import ReplyForm from "./ReplyForm";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import {
  useDislikeReviewMutation,
  useLikeReviewMutation,
} from "../slices/recipesApiSlice";
import ReplyList from "./ReplyList";

interface ReviewsContainerProps {
  recipe: Recipe;
  userId: string;
}

const ReviewsContainer: React.FC<ReviewsContainerProps> = ({
  recipe,
  userId,
}) => {
  const [reviews, setReviews] = useState<Review[]>(recipe.reviews);
  const [replyClickedReview, setReplyClickedReview] = useState<string | null>(
    null,
  );
  const [replyingToFullName, setReplyingToFullName] = useState<string | null>(
    null,
  );

  const updateReplies = (reviewId: string, newReply: Reply) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review._id === reviewId
          ? { ...review, replies: [...review.replies, newReply] }
          : review,
      ),
    );
  };

  const [likeReview] = useLikeReviewMutation();
  const [dislikeReview] = useDislikeReviewMutation();

  const handleReplyClick = (reviewId: string, fullName: string) => {
    setReplyClickedReview(replyClickedReview === reviewId ? null : reviewId);
    setReplyingToFullName(fullName);
  };

  const handleLikeClick = async (recipeId: string, reviewId: string) => {
    if (!userId) {
      toast.error("You need to be logged in to like a review.");
      return;
    }

    try {
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                likes: (review.likes || []).includes(userId)
                  ? (review.likes || []).filter((id) => id !== userId)
                  : [...(review.likes || []), userId],
                dislikes: (review.dislikes || []).filter((id) => id !== userId),
              }
            : review,
        ),
      );

      await likeReview({ recipeId, reviewId });
    } catch (error) {
      console.error("Failed to like review:", error);
      toast.error("Failed to like review.");
    }
  };

  const handleDislikeClick = async (recipeId: string, reviewId: string) => {
    if (!userId) {
      toast.error("You need to be logged in to dislike a review.");
      return;
    }

    try {
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                dislikes: (review.dislikes || []).includes(userId)
                  ? (review.dislikes || []).filter((id) => id !== userId)
                  : [...(review.dislikes || []), userId],
                likes: (review.likes || []).filter((id) => id !== userId),
              }
            : review,
        ),
      );

      await dislikeReview({ recipeId, reviewId });
    } catch (error) {
      console.error("Failed to dislike review:", error);
      toast.error("Failed to dislike review.");
    }
  };

  return (
    <div className="reviews__container mt-12  ">
      {reviews.map((review) => (
        <div
          className="flex gap-2 border-b border-gray-200 pb-8 lg:px-4 lg:py-8 "
          key={review._id}
        >
          <div className="xl basis-[20%] md:basis-[7%] xl:basis-[5%] 2xl:basis-[3%] ">
            <img
              src={review.image}
              alt={review.fullName}
              className="h-[35px] w-[35px] rounded-full object-cover lg:h-[40px] lg:w-[40px]"
              loading="lazy"
            />
          </div>
          <div className="info__container basis-[96%] md:basis-full">
            <div className="flex flex-col  ">
              <h1 className=" text-sm font-medium md:text-base lg:text-lg">
                {review.fullName}
              </h1>
              <h1 className="text-sm text-gray-500 md:text-base">
                {formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                })}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Rating value={review.rating} />
            </div>
            <p className="mt-3 whitespace-normal break-words text-sm md:text-base">
              {review.comment}
            </p>

            <div className="reviews-likes-reply__container  flex items-center ">
              <button
                onClick={() => handleLikeClick(recipe._id, review._id)}
                disabled={!userId}
              >
                {review.likes?.includes(userId) ? (
                  <BiSolidLike size={20} color="#2E5834" />
                ) : (
                  <BiLike size={20} color="#2D2D2D" />
                )}
              </button>

              <span
                className={`${review.likes?.length > 0 ? "ml-2" : ""}  text-sm  font-medium text-gray-700`}
              >
                {review.likes?.length > 0 && review.likes.length}
              </span>

              <button
                onClick={() => handleDislikeClick(recipe._id, review._id)}
                disabled={!userId}
                className="ml-2"
              >
                {review.dislikes?.includes(userId) ? (
                  <BiSolidDislike size={20} color="#2E5834" />
                ) : (
                  <BiDislike size={20} color="#2D2D2D" />
                )}
              </button>

              <button
                onClick={() => handleReplyClick(review._id, review.fullName)}
                className={`${review.user === userId ? "invisible" : ""} ml-3 rounded-full px-4 py-2 text-base text-gray-700 hover:bg-gray-100`}
              >
                Reply
              </button>
            </div>

            {replyClickedReview === review._id && (
              <ReplyForm
                recipeId={recipe._id}
                reviewId={review._id}
                parentReplyId={null}
                replyingToFullName={replyingToFullName}
                setReplyClicked={setReplyClickedReview}
                updateReplies={updateReplies}
              />
            )}

            <ReplyList
              userId={userId}
              review={review}
              recipe={recipe}
              setReviews={setReviews}
              setReplyClicked={setReplyClickedReview}
              replyClicked={replyClickedReview}
              updateReplies={updateReplies}
              recipeId={recipe._id}
              reviewId={review._id}
              replies={review.replies}
              handleReplyClick={handleReplyClick}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsContainer;
