import mongoose, { Document, Schema } from "mongoose";

interface EmailResetDocument extends Document {
  email: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

const emailResetSchema = new Schema<EmailResetDocument>({
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

const EmailReset = mongoose.model<EmailResetDocument>(
  "EmailReset",
  emailResetSchema
);

export default EmailReset;
