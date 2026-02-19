import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./utils/prisma";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});
app.post("/users", async (req, res) => {
  const body = req.body;
  const users = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
    },
  });
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
