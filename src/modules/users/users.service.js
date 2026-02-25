import usersModel from "./users.model.js";
import bcrypt from "bcrypt";

const createUserService = async ({
  name,
  email,
  gender,
  role,
  status,
  password,
}) => {
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

const getUserByIdService = async (id) => {
  if (!id) throw new Error("User ID is required");
  const user = await usersModel.getUserById(id);
  return user;
};

const updateUserService = async (id, { name, email, gender }) => {
  if (!id) throw new Error("User ID is required");
  if (!name && !email && !gender)
    throw new Error("At least one field is required to update");

  // check if user exists
  const existingUser = await usersModel.getUserById(id);
  if (!existingUser) throw new Error("User not found");

  // if email is being changed, check for duplicates
  if (email && email !== existingUser.email) {
    const emailTaken = await usersModel.getEmail(email);
    if (emailTaken) throw new Error("Email already in use by another user");
  }

  const updatedUser = await usersModel.updateUser(
    id,
    name || existingUser.name,
    email || existingUser.email,
    gender || existingUser.gender,
  );
  return updatedUser;
};

const deleteUserService = async (id) => {
  if (!id) throw new Error("User ID is required");

  const existingUser = await usersModel.getUserById(id);
  if (!existingUser) throw new Error("User not found");

  const deletedUser = await usersModel.deleteUser(id);
  return deletedUser;
};

export default {
  createUserService,
  getAllUserService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
};
