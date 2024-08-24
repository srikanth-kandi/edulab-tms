import { In } from "typeorm";
import AppDataSource from "../data-source.js";
import Task from "../entity/Task.js";
import User from "../entity/User.js";

const taskRepository = AppDataSource.getRepository(Task);
const userRepository = AppDataSource.getRepository(User);

// Create a new task
export async function createTask(req, res) {
  const { title, description, status } = req.body;

  try {
    const user = await userRepository.findOne({ where: { id: req.userId } });
    const newTask = taskRepository.create({ title, description, status, user });
    await taskRepository.save(newTask);

    res.status(201).json({
      id: newTask.id,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

// Update an existing task
export async function updateTask(req, res) {
  const { id, title, description, status } = req.body;

  try {
    const existingTask = await taskRepository.findOne({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if task belongs to the requesting user
    if (existingTask.userId !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    existingTask.title = title;
    existingTask.description = description;
    existingTask.status = status;

    await taskRepository.save(existingTask);
    res.json({
      id: existingTask.id,
      title: existingTask.title,
      description: existingTask.description,
      status: existingTask.status,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

// Delete a task
export async function deleteTask(req, res) {
  const { id } = req.params;

  try {
    const existingTask = await taskRepository.findOne({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if task belongs to the requesting user
    if (existingTask.userId !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await taskRepository.remove(existingTask);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

// Get all tasks
export async function getTasks(req, res) {
  const { status } = req.query;

  try {
    let tasks = [];

    if (req.userRole === "admin") {
      // Admin fetching tasks for all users in their organization including self
      // Step 1: Retrieve all users in the organization
      const usersInOrganization = await userRepository.find({
        where: { organization: { id: req.userOrgId } },
      });

      // Extract user IDs from the users in the organization
      const userIds = usersInOrganization.map((user) => user.id);

      // Step 2: Fetch tasks for all users in the organization
      tasks = await taskRepository.find({
        where: { user: { id: In(userIds) } },
        relations: ["user"],
      });
    } else {
      // Regular user fetching their own tasks
      tasks = await taskRepository.find({
        where: { user: { id: req.userId } },
        relations: ["user"],
      });
    }

    // Step 3: Filter by status if provided
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    // Step 4: Map tasks to include userId
    const tasksWithUserId = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      userId: task.user.id,
    }));

    // Step 5: Return tasks as a response
    return res.json(tasksWithUserId);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Get a task by ID
export async function getTask(req, res) {
  const { id } = req.params;

  try {
    const task = await taskRepository.findOne({ where: { id } });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if task belongs to the requesting user
    if (task.userId !== req.userId && req.userRole !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
