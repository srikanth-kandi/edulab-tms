import AppDataSource from "../data-source.js";
import Task from "../entity/Task.js";
import User from "../entity/User.js";

const taskRepository = AppDataSource.getRepository(Task);
const userRepository = AppDataSource.getRepository(User);

export async function createTask(req, res) {
  const { title, description, status } = req.body;

  try {
    const user = await userRepository.findOne({ where: { id: req.user.id } });
    const newTask = taskRepository.create({ title, description, status, user });
    await taskRepository.save(newTask);

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

// Implement other CRUD operations similarly
