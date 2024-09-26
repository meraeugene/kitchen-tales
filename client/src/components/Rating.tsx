import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { RatingProps } from "../types";

const Rating = ({ value, numReviews }: RatingProps) => {
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-start gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        return (
          <span key={index}>
            {value >= starValue ? (
              <FaStar size={16} color="#2E5834" />
            ) : value >= starValue - 0.5 ? (
              <FaStarHalfAlt size={16} color="#2E5834" />
            ) : (
              <FaRegStar size={16} color="#2E5834" />
            )}
          </span>
        );
      })}
      {numReviews !== undefined && (
        <div className="ml-1 text-gray-600 lg:text-base">
          {numReviews > 0 ? `${numReviews} reviews` : "No reviews"}
        </div>
      )}
    </div>
  );
};

export default Rating;
