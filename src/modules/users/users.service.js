import usersModel from "./users.model.js";
import bcrypt from "bcrypt";

const createUserService = async ({ name, email, gender, role, status, password}) => {
  // validate
  if (!name || !email || !gender || !role || !status || !password)
    throw new Error("All Fields are required");

  // existing user
  const existingUser = await usersModel.getEmail(email);
  if (existingUser) throw new Error("User already exists with this email");

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // create user
  const user = await usersModel.create(
    name,
    email,
    hashedPassword,
    role,
    gender,
    status,
  );
  return user;
};

const getAllUserService = async () => {
  const users = await usersModel.getAll();
  return users;
};

export default {
  createUserService,
  getAllUserService,
};
