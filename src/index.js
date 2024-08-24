import "reflect-metadata";
import express from "express";
import cors from "cors";
import AppDataSource from "./data-source.js";
import taskRoutes from "./routes/taskRoutes.js";
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
    app.get("/", (req, res) => {
      res.send("Welcome to Task Manager API");
    });

    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization", error)
  );
