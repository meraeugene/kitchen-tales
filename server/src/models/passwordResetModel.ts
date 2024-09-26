import mongoose, { Document, Schema } from "mongoose";

interface PasswordResetDocument extends Document {
  email: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

const passwordResetSchema = new Schema<PasswordResetDocument>({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 3600 * 1000), // 1 hour expiration
  },
});

const PasswordReset = mongoose.model<PasswordResetDocument>(
  "PasswordReset",
  passwordResetSchema
);

export default PasswordReset;
