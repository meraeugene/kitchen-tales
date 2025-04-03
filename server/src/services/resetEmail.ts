import EmailReset from "../models/resetEmailModel";
import { transporter } from "../config/transporter";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface ResetEmailParams {
  _id: string;
  email: string;
}

const sendResetEmail = async ({ _id, email }: ResetEmailParams) => {
  try {
    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the reset token before storing it
    const hashedResetToken = await bcrypt.hash(resetToken, 10);

    // Create a email reset document in the database
    const newEmailReset = new EmailReset({
      email,
      token: hashedResetToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // Token expires in 1 hour
    });

    await newEmailReset.save();

    // Construct the email reset link with the hashed token
    // const resetLink = `http://localhost:5173/reset-email?token=${hashedResetToken}`;
    const resetLink = `https://kitchen-tales.onrender.com/reset-email?token=${hashedResetToken}`;

    // Create the email content
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Email Reset Request",
      html: `
        <img src="https://res.cloudinary.com/dupynxkci/image/upload/v1709650326/bjwe2j4z110rj1jxvwbl.png"/>
        <p>Hello, <a style="font-weight: bold;">${email}</a>,</p>
        <p>We received a request to reset your email. If you didn't make this request, you can ignore this email.</p>
        <p>Click the following link to reset your email:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #2E5834; color: white; text-decoration: none; border-radius: 4px;">Reset Email</a>
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
        "A email reset link has been sent to your registered email address. Please check your inbox and follow the instructions to reset your email.",
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

export { sendResetEmail };
