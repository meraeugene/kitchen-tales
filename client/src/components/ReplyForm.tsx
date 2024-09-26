import {
  useState,
  FC,
  FormEvent,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
} from "react";
import { useAddReplyToReviewMutation } from "../slices/recipesApiSlice";
import { useGetUserProfileQuery } from "../slices/usersApiSlice";
import { toast } from "react-toastify";

interface ReplyFormProps {
  recipeId: string;
  reviewId: string;
  parentReplyId: string | null;
  replyingToFullName: string | null;
  updateReplies: (reviewId: string, newReply: any) => void;
  setReplyClicked: Dispatch<SetStateAction<string | null>>;
}

const ReplyForm: FC<ReplyFormProps> = ({
  recipeId,
  reviewId,
  parentReplyId,
  replyingToFullName,
  updateReplies,
  setReplyClicked,
}) => {
  const { data: userData } = useGetUserProfileQuery({});
  const [comment, setComment] = useState<string>("");

  const [addReplyToReview] = useAddReplyToReviewMutation();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!userData) {
        throw new Error("User data is not available.");
      }

      const replyComment = replyingToFullName
        ? `@${replyingToFullName} ${comment}`
        : comment;

      const newReply = {
        comment: replyComment,
        image: userData.image,
        user: userData._id,
        fullName: userData.fullName,
        parentReplyId,
        createdAt: new Date().toISOString(),
      };

      updateReplies(reviewId, newReply);
      await addReplyToReview({ recipeId, reviewId, reply: newReply }).unwrap();

      setComment("");
      setReplyClicked(null);

      toast.success("Reply added successfully!");
    } catch (error) {
      console.error("Failed to add reply:", error);
      toast.error("Failed to add reply.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitHandler(e as unknown as FormEvent<HTMLFormElement>);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to scrollHeight
    }
  };

  // Initialize textarea height on component mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  return (
    <div className="reply__container mt-2  lg:w-1/2">
      <form onSubmit={submitHandler}>
        <div className="flex w-full   lg:gap-6">
          <div className="basis-[20%] md:basis-[9%] lg:basis-[12%] xl:basis-[7%] 2xl:basis-[5%]">
            <img
              src={userData?.image}
              alt={userData?.fullName}
              className="h-[35px] w-[35px] cursor-pointer rounded-full object-cover"
            />
          </div>

          <div className="basis-[80%] md:basis-full">
            <textarea
              ref={textareaRef}
              value={comment}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
              className=" w-full resize-none overflow-hidden border-b border-gray-400 text-sm outline-none md:text-base"
              placeholder={
                replyingToFullName
                  ? `Replying to ${replyingToFullName}...`
                  : "Add a reply..."
              }
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={() => setReplyClicked(null)}
            className="rounded-full px-3 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-[#2E5834] px-3 py-2 text-white"
          >
            Reply
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;
