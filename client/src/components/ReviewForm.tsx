import { FaStar } from "react-icons/fa";
import { useCreateReviewMutation } from "../slices/recipesApiSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import { ErrorResponse } from "../types";

interface ReviewProps {
  recipeId: string | null;
  refetch: () => void;
}

const ReviewForm = ({ recipeId, refetch }: ReviewProps) => {
  // review
  const [createReview, { isLoading: loadingRecipeReview }] =
    useCreateReviewMutation();

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createReview({
        recipeId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success(res.message);

      setRating(0);
      setComment("");
    } catch (error) {
      const errorMessage =
        (error as ErrorResponse)?.data?.error ||
        (error as ErrorResponse)?.data?.message ||
        "An unknown error occurred.";

      toast.error(errorMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Submit on Enter without Shift key
      e.preventDefault(); // Prevent new line
      handleSubmit(e as unknown as React.FormEvent); // Trigger form submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rating__container w-full ">
      <h2 className=" mb-1 text-base font-medium lg:text-lg">
        Your Rating: <span className="text-sm text-gray-500"> (required)</span>
      </h2>

      <div className="flex items-center  space-x-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <FaStar
            key={value}
            className={`cursor-pointer ${
              value <= rating ? "text-green-800" : "text-gray-300"
            }`}
            size={20}
            onClick={() => setRating(value)}
          />
        ))}
      </div>

      <div className="review-comment__container mt-4">
        <h2 className=" mb-2 text-base font-medium lg:text-lg">
          Your Review:{" "}
          <span className="text-sm text-gray-500"> (required)</span>
        </h2>
        <textarea
          rows={5}
          style={{ height: "auto" }}
          placeholder="Share your love! Tell us what you thought about the recipe in a quick review."
          className="h-[48px] w-full  resize-none rounded-sm border border-gray-200 p-3 outline-none"
          value={comment}
          wrap="soft"
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown} // Handle Enter key press
        />
      </div>

      <button
        type="submit"
        className="mt-4 flex h-[45px] w-full items-center justify-center rounded-full  bg-[#2E5834] px-6 py-2 text-white lg:w-[20%] "
        disabled={loadingRecipeReview}
      >
        {loadingRecipeReview ? (
          <div className="flex  items-center justify-center gap-3">
            <l-dot-pulse size="38" speed="1.3" color="white"></l-dot-pulse>
          </div>
        ) : (
          <span> Post Review</span>
        )}
      </button>
    </form>
  );
};

export default ReviewForm;
