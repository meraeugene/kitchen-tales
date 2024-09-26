import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface UserDocument extends mongoose.Document {
  fullName: string;
  image?: string | null | undefined;
  email: string;
  password?: string | undefined;
  isAdmin: boolean;
  remindStatus?: boolean | undefined;
  aboutMe?: string | undefined;
  address?: string | undefined;
  socials: {
    fbLink?: string | undefined;
    igLink?: string | undefined;
    twitterLink?: string | undefined;
    linkedinLink?: string | undefined;
  };
  matchPassword: (plainPassword: string) => Promise<boolean>;
  bookmarks: string[];
}

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default:
        "https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    remindStatus: {
      type: Boolean,
      required: false,
      default: false,
    },
    address: {
      type: String,
      required: false,
      default: "No Address Added",
    },
    aboutMe: {
      type: String,
      required: false,
      default: "No Bio Added",
    },
    socials: {
      fbLink: {
        type: String,
        required: false,
      },
      igLink: {
        type: String,
        required: false,
      },
      twitterLink: {
        type: String,
        required: false,
      },
      linkedinLink: {
        type: String,
        required: false,
      },
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookmark",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (plainPassword: string) {
  return await bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
