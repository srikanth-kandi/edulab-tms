import AppDataSource from "../data-source.js";
import bcrypt from "bcryptjs";
import User from "../entity/User.js";

const userRepository = AppDataSource.getRepository(User);

// Create a new user
export async function createUser(req, res) {
  const { username, password, role } = req.body;

  try {
    // only admin can create users
    if (req.userRole !== "admin") {
      return res.status(403).json({ message: "Unauthorized to create user" });
    }

    // check if username is unique
    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // check password atleast 8 characters and contains a number, a lowercase letter, an uppercase letter, and a special character
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain a number, a lowercase letter, an uppercase letter, and a special character",
      });
    }

    if (role !== "admin" && role !== "user") {
      return res
        .status(400)
        .json({ message: "Invalid role, can be only 'admin' or 'user'" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      username,
      password: hashedPassword,
      role,
      organization: req.userOrgId,
    });
    await userRepository.save(newUser);

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

// Update user details
export async function updateUser(req, res) {
  const { id, username, password, role } = req.body;

  try {
    const user = await userRepository.findOne({
      where: { id },
      relations: ["organization"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // admin can update only users in the same organization, user can update only self
    if (req.userRole === "admin" && user.organization.id !== req.userOrgId) {
      return res.status(403).json({
        message: "Unauthorized to update other Organization users",
      });
    }

    if (req.userRole !== "admin" && user.id !== req.userId) {
      return res.status(403).json({
        message: "Unauthorized to update other users in Organization",
      });
    }

    // check new username is unique
    if (username) {
      const existingUser = await userRepository.findOne({
        where: { username },
      });
      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    // check password atleast 8 characters and contains a number, a lowercase letter, an uppercase letter, and a special character
    if (password) {
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long and contain a number, a lowercase letter, an uppercase letter, and a special character",
        });
      }
    }

    if (role && role !== "admin" && role !== "user") {
      return res
        .status(400)
        .json({ message: "Invalid role, can be only 'admin' or 'user'" });
    }

    if (role !== user.role && req.userRole !== "admin") {
      return res.status(403).json({ message: "Unauthorized to changed role" });
    }

    // if user is admin, check if there is atleast one admin in the organization
    if (role === "user" && user.role === "admin") {
      const usersInOrganization = await userRepository.find({
        where: { organization: { id: user.organization.id } },
      });

      const adminUsers = usersInOrganization.filter(
        (user) => user.role === "admin"
      );

      if (adminUsers.length === 1) {
        return res.status(400).json({
          message: "Cannot change the only admin user in the organization",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.username = username || user.username;
    user.password = hashedPassword || user.password;
    user.role = role || user.role;

    await userRepository.save(user);

    res.status(200).json({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

// Delete a user
export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const user = await userRepository.findOne({
      where: { id },
      relations: ["organization"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // admin can delete only users in the same organization, user can delete only self
    if (req.userRole === "admin" && user.organization.id !== req.userOrgId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete other Organization users" });
    }

    if (req.userRole !== "admin" && user.id !== req.userId) {
      return res.status(403).json({
        message: "Unauthorized to delete other users in Organization",
      });
    }

    // if user is admin, check if there is atleast one admin in the organization
    if (user.role === "admin") {
      const usersInOrganization = await userRepository.find({
        where: { organization: { id: user.organization.id } },
      });

      const adminUsers = usersInOrganization.filter(
        (user) => user.role === "admin"
      );

      if (adminUsers.length === 1) {
        return res.status(400).json({
          message: "Cannot delete the only admin user in the organization",
        });
      }
    }

    await userRepository.remove(user);

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

// Get all users
export async function getUsers(req, res) {
  try {
    // retrive only current organization users even if the user is admin
    const users = await userRepository.find({
      where: { organization: { id: req.userOrgId } },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

// Get a user
export async function getUser(req, res) {
  const { id } = req.params;

  try {
    const user = await userRepository.findOne({
      where: { id },
      relations: ["organization"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // get current organization userIds and only return if the user is in the organization
    const usersInOrganization = await userRepository.find({
      where: { organization: { id: req.userOrgId } },
    });

    const userIds = usersInOrganization.map((user) => user.id);

    if (!userIds.includes(user.id)) {
      return res.status(400).json({ message: "User not in organization" });
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      role: user.role,
      orgId: user.organization.id,
      orgName: user.organization.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
