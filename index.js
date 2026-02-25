import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import usersRoute from "./src/modules/users/users.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/users", usersRoute);
app.get("/", (req, res) => {
  res.send("welcome to the attendence system");
});

app.use((err, req, res, next) => {
  res.status(404).json({
    success: false,
    message: err.message || "Not Found",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

