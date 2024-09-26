import mongoose from "mongoose";

export interface Reply {
  _id: mongoose.Types.ObjectId; // Use ObjectId here
  user: string;
  fullName?: string;
  image?: string;
  comment: string;
  parentReplyId?: string;
  replies: Reply[];
  likes: mongoose.Types.ObjectId[]; // Change to ObjectId
  dislikes: mongoose.Types.ObjectId[]; // Change to ObjectId
}

export interface Review {
  rating: number;
  _id: mongoose.Types.ObjectId; // Use ObjectId here
  user: string;
  fullName?: string;
  image?: string;
  comment: string;
  replies: Reply[];
  likes: mongoose.Types.ObjectId[]; // Change to ObjectId
  dislikes: mongoose.Types.ObjectId[]; // Change to ObjectId
}

export const findReply = (replies: Reply[], replyId: string): Reply | null => {
  for (let reply of replies) {
    if (reply._id.toString() === replyId) return reply;
    if (reply.replies && reply.replies.length > 0) {
      const nestedReply = findReply(reply.replies, replyId);
      if (nestedReply) return nestedReply;
    }
  }
  return null;
};
