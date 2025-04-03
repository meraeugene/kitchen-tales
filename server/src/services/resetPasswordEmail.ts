import PasswordReset from "../models/passwordResetModel";
import { transporter } from "../config/transporter";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface ResetPasswordParams {
  _id: string;
  email: string;
}

const sendResetPasswordEmail = async ({ _id, email }: ResetPasswordParams) => {
  try {
    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the reset token before storing it
    const hashedResetToken = await bcrypt.hash(resetToken, 10);

    // Create a password reset document in the database
    const newPasswordReset = new PasswordReset({
      email,
      token: hashedResetToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // Token expires in 1 hour
    });

    await newPasswordReset.save();

    // Construct the password reset link with the hashed token
    // const resetLink = `http://localhost:5173/reset-password?token=${hashedResetToken}`;
    const resetLink = `https://kitchen-tales.onrender.com/reset-password?token=${hashedResetToken}`;

    // Create the email content
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: `
        <img src="https://res.cloudinary.com/dupynxkci/image/upload/v1709650326/bjwe2j4z110rj1jxvwbl.png"/>
        <p>Hello, <a style="font-weight: bold;">${email}</a>,</p>
        <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
        <p>Click the following link to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #2E5834; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
        <p>The link will expire in <b>1 hour</b>.</p>
        <p>If you have any issues, please contact our support team.</p>
        <p>Best regards,<br>Kitchen Tales</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return {
      status: "PENDING",
      message:
        "A password reset email has been sent to your registered email address. Please check your inbox and follow the instructions to reset your password.",
      data: {
        _id,
        email,
        resetToken,
      },
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export { sendResetPasswordEmail };
