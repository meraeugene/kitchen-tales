import PasswordReset from "../models/passwordResetModel";
import bcrypt from "bcryptjs";

// Function to verify the password reset token
const verifyResetToken = async (
  email: string,
  token: string
): Promise<{ isValid: boolean; message: string }> => {
  try {
    // Retrieve the user's password reset document from the database
    const passwordResetDocument = await PasswordReset.findOne({ email });

    if (!passwordResetDocument) {
      return { isValid: false, message: "Token not found in the database" };
    }

    // Compare the provided token with the hashed token in the database
    const isTokenValid = await bcrypt.compare(
      token,
      passwordResetDocument.token
    );

    if (!isTokenValid) {
      return { isValid: false, message: "Invalid token" };
    }

    // Check if the token has expired
    const currentTime = Date.now();
    if (currentTime > passwordResetDocument.expiresAt.getTime()) {
      // Token has expired
      return { isValid: false, message: "Token has expired" };
    }

    return { isValid: true, message: "Token is valid" };
  } catch (error) {
    console.error("Error verifying reset token:", error);
    return { isValid: false, message: "Error verifying reset token" };
  }
};

export { verifyResetToken };
