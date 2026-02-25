import usersService from "./users.service.js";

const createUserController = async (req, res) => {
  try {
    const newUser = await usersService.createUserService(req.body);
    if (!newUser)
      res.status(400).json({
        success: false,
        message: "User not created",
      });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllUserController = async (req, res) => {
  try {
    const users = await usersService.getAllUserService();
    if (!users)
      return res.status(404).json({
        success: false,
        message: "Users not found",
      });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersService.getUserByIdService(id);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await usersService.updateUserService(id, req.body);
    if (!updatedUser)
      return res.status(404).json({
        success: false,
        message: "User not found or not updated",
      });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await usersService.deleteUserService(id);
    if (!deletedUser)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createUserController,
  getAllUserController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
};
