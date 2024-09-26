import { formatDistanceToNow } from "date-fns";
// import { toast } from "react-toastify";
// import {
//   useDislikeReplyMutation,
//   useLikeReplyMutation,
// } from "../slices/recipesApiSlice";
import { Recipe, Reply, Review } from "../types";
import { Dispatch, FC, SetStateAction, useState } from "react";
// import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import ReplyForm from "./ReplyForm";

interface ReplyListProps {
  userId: string;
  setReviews: Dispatch<SetStateAction<Review[]>>;
  review: Review;
  recipe: Recipe;
  setReplyClicked: Dispatch<SetStateAction<string | null>>;
  replyClicked?: string | null;
  updateReplies: (reviewId: string, newReply: Reply) => void;
  parentReplyId?: string | null;
  recipeId: string;
  reviewId: string;
  replies: Reply[];
  handleReplyClick: (reviewId: string, fullName: string) => void;
}

const ReplyList: FC<ReplyListProps> = ({
  userId,
  setReviews,
  review,
  recipe,
  replyClicked,
  setReplyClicked,
  updateReplies,
  recipeId,
  reviewId,
  replies,
  parentReplyId,
}) => {
  // const [likeReply] = useLikeReplyMutation();
  // const [dislikeReply] = useDislikeReplyMutation();

  const highlightMention = (comment: string) => {
    const mentionRegex = /(@\w+\s\w+)/g;
    return comment.split(mentionRegex).map((part, index) => {
      const key = `${part}-${index}`; // Ensure a unique key
      if (mentionRegex.test(part)) {
        return (
          <span key={key} style={{ color: "#2E5834", fontWeight: "500" }}>
            {part}
          </span>
        );
      }
      return <span key={key}>{part}</span>; // Wrap non-mention parts too
    });
  };

  // const handleReplyLikeClick = async (
  //   recipeId: string,
  //   reviewId: string,
  //   replyId: string,
  // ) => {
  //   if (!userId) {
  //     toast.error("You need to be logged in to like a reply.");
  //     return;
  //   }

  //   try {
  //     setReviews((prevReviews) =>
  //       prevReviews.map((review) =>
  //         review._id === reviewId
  //           ? {
  //               ...review,
  //               replies: updateReplyLikes(
  //                 review.replies,
  //                 replyId,
  //                 userId,
  //                 "like",
  //               ),
  //             }
  //           : review,
  //       ),
  //     );
  //     await likeReply({ recipeId, reviewId, replyId }); // call the API
  //   } catch (error) {
  //     console.error("Failed to like reply:", error);
  //     toast.error("Failed to like reply.");
  //   }
  // };

  // const handleReplyDislikeClick = async (
  //   recipeId: string,
  //   reviewId: string,
  //   replyId: string,
  // ) => {
  //   if (!userId) {
  //     toast.error("You need to be logged in to dislike a reply.");
  //     return;
  //   }

  //   try {
  //     setReviews((prevReviews) =>
  //       prevReviews.map((review) =>
  //         review._id === reviewId
  //           ? {
  //               ...review,
  //               replies: updateReplyLikes(
  //                 review.replies,
  //                 replyId,
  //                 userId,
  //                 "dislike",
  //               ),
  //             }
  //           : review,
  //       ),
  //     );
  //     await dislikeReply({ recipeId, reviewId, replyId });
  //   } catch (error) {
  //     console.error("Failed to dislike reply:", error);
  //     toast.error("Failed to dislike reply.");
  //   }
  // };

  // // Helper function to update likes/dislikes in nested replies
  // const updateReplyLikes = (
  //   replies: Reply[],
  //   replyId: string,
  //   userId: string,
  //   type: "like" | "dislike",
  // ): Reply[] => {
  //   return replies.map((reply) => {
  //     const likes = reply.likes || []; // Default to empty array
  //     const dislikes = reply.dislikes || []; // Default to empty array

  //     if (reply._id === replyId) {
  //       const isLiked = likes.includes(userId);
  //       const isDisliked = dislikes.includes(userId);

  //       return {
  //         ...reply,
  //         likes:
  //           type === "like"
  //             ? isLiked
  //               ? likes.filter((id) => id !== userId)
  //               : [...likes, userId]
  //             : isLiked
  //               ? likes.filter((id) => id !== userId)
  //               : likes,
  //         dislikes:
  //           type === "dislike"
  //             ? isDisliked
  //               ? dislikes.filter((id) => id !== userId)
  //               : [...dislikes, userId]
  //             : isDisliked
  //               ? dislikes.filter((id) => id !== userId)
  //               : dislikes.filter((id) => id !== userId), // Ensure removing from likes when disliking
  //       };
  //     }

  //     if (reply.replies && reply.replies.length > 0) {
  //       return {
  //         ...reply,
  //         replies: updateReplyLikes(reply.replies, replyId, userId, type),
  //       };
  //     }

  //     return reply;
  //   });
  // };

  const [clickedReply, setClickedReply] = useState<string | null>(null);

  const handleReplyClick = (replyId: string) => {
    setClickedReply((prevReply) => (prevReply === replyId ? null : replyId));
  };

  return (
    <div>
      {replies.map((reply) => {
        return (
          <div key={`${reply._id}-${parentReplyId}`} className="mt-4 w-full">
            <div className="flex gap-4">
              <div className="basis-[20%] md:basis-[7%] xl:basis-[4%] 2xl:basis-[3%]  ">
                <img
                  src={reply.image}
                  alt={reply.fullName}
                  className="h-[30px] w-[30px] rounded-full object-cover md:h-[35px] md:w-[35px] lg:h-[40px] lg:w-[40px]"
                  loading="lazy"
                />
              </div>
              <div className="basis-[97%] md:basis-full">
                <div className="flex flex-col  ">
                  <p className="text-sm font-medium md:text-base">
                    {reply.fullName}
                  </p>
                  <small className="text-gray-500 md:text-base">
                    {formatDistanceToNow(new Date(reply.createdAt), {
                      addSuffix: true,
                    })}
                  </small>
                </div>
                <p className="mt-2 whitespace-normal break-words text-sm md:text-base">
                  {highlightMention(reply.comment)}
                </p>
                <div className="reply-likes__container mt-1 flex items-center ">
                  {/* <button
                    onClick={() =>
                      handleReplyLikeClick(recipe._id, review._id, reply._id)
                    }
                  >
                    {reply.likes?.includes(userId) ? (
                      <BiSolidLike size={20} color="#2E5834" />
                    ) : (
                      <BiLike size={20} color="#2D2D2D" />
                    )}
                  </button>

                  <span
                    className={`${
                      reply.likes?.length > 0 ? "ml-2" : ""
                    }  text-sm  font-medium text-gray-700`}
                  >
                    {reply.likes?.length > 0 && reply.likes.length}
                  </span>

                  <button
                    onClick={() =>
                      handleReplyDislikeClick(recipe._id, review._id, reply._id)
                    }
                    className="ml-2"
                  >
                    {reply.dislikes?.includes(userId) ? (
                      <BiSolidDislike size={20} color="#2E5834" />
                    ) : (
                      <BiDislike size={20} color="#2D2D2D" />
                    )}
                  </button> */}

                  <button
                    onClick={() => handleReplyClick(reply._id)}
                    className={`${reply.user === userId ? "hidden" : ""}  rounded-full  py-2 text-base text-gray-700 hover:underline `}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>

            {clickedReply === reply._id && (
              <ReplyForm
                recipeId={recipe._id}
                reviewId={review._id}
                parentReplyId={reply._id}
                replyingToFullName={reply.fullName}
                setReplyClicked={setClickedReply}
                updateReplies={updateReplies}
              />
            )}

            {/* Recursive call to render nested replies */}
            {reply.replies && reply.replies.length > 0 && (
              <ReplyList
                replies={reply.replies}
                recipeId={recipeId}
                reviewId={reviewId}
                parentReplyId={reply._id}
                setReplyClicked={setReplyClicked}
                updateReplies={updateReplies}
                replyClicked={replyClicked}
                userId={userId}
                setReviews={setReviews}
                recipe={recipe}
                review={review}
                handleReplyClick={handleReplyClick}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReplyList;
