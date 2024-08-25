import "reflect-metadata";
import express from "express";
import cors from "cors";
import AppDataSource from "./data-source.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orgRoutes from "./routes/orgRoutes.js";
import * as authController from "./controller/authController.js";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Data Source
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    app.post("/register", authController.register);
    app.post("/login", authController.login);
    app.use("/tasks", taskRoutes);
    app.use("/users", userRoutes);
    app.use("/organizations", orgRoutes);
    app.get("/", (req, res) => {
      res.send({
        message: "Welcome to Task Management System API!",
        apiDocs: "https://github.com/srikanth-kandi/edulab-tms#readme",
        aboutMe: "https://www.srikanthkandi.me",
        resume: "https://www.srikanthkandi.me/resume",
        linkedIn: "https://www.linkedin.com/in/srikanthkandi",
      });
    });

    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization", error)
  );
