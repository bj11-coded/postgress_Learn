import usersController from "./users.controller.js";
import express from "express";

const router = express.Router();

router.post("/register", usersController.createUserController);
router.get("/get-all", usersController.getAllUserController);

export default router;


