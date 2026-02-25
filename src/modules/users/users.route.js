import usersController from "./users.controller.js";
import express from "express";

const router = express.Router();

router.post("/register", usersController.createUserController);
router.get("/get-all", usersController.getAllUserController);
router.get("/:id", usersController.getUserByIdController);
router.put("/:id", usersController.updateUserController);
router.delete("/:id", usersController.deleteUserController);

export default router;
