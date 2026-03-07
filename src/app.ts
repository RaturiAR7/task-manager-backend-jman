import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes");
const projectMemberRoutes = require("./routes/projectMember.routes");

app.use("/user", userRoutes);
app.use("/projects", projectRoutes);
app.use("/projectMembers", projectMemberRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
