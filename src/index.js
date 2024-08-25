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
      res.send({
        message: "Welcome to Task Management System API!",
        API: {
          tasks: {
            get: "GET https://tms.srikanthkandi.me/tasks",
            getById: "GET https://tms.srikanthkandi.me/tasks/:id",
            create: "POST https://tms.srikanthkandi.me/tasks",
            update: "PUT https://tms.srikanthkandi.me/tasks/:id",
            delete: "DELETE https://tms.srikanthkandi.me/tasks/:id",
          },
          register: "POST https://tms.srikanthkandi.me/register",
          login: "POST https://tms.srikanthkandi.me/login",
        },
        GitHub: "https://github.com/srikanth-kandi/edulab-tms",
        AboutMe: "https://www.srikanthkandi.me",
        Resume: "https://www.srikanthkandi.me/resume",
        LinkedIn: "https://www.linkedin.com/in/srikanthkandi",
      });
    });

    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization", error)
  );
