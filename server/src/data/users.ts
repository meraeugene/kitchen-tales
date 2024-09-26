import bcrypt from "bcryptjs";

const users = [
  {
    fullName: "Admin User",
    email: "admin@email.com",
    password: bcrypt.hashSync("admin123", 10),
    isAdmin: true,
  },
];

export default users;
