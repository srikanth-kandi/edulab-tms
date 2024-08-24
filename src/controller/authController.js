import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppDataSource from "../data-source.js";
import User from "../entity/User.js";
import Organization from "../entity/Organization.js";
import { config } from "dotenv";

config();

const userRepository = AppDataSource.getRepository(User);
const organizationRepository = AppDataSource.getRepository(Organization);

export async function register(req, res) {
  const { username, password, organizationName, existingOrganizationId } =
    req.body;

  try {
    let organization;

    if (existingOrganizationId) {
      // Join existing organization
      organization = await organizationRepository.findOne(
        existingOrganizationId
      );
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }
    } else if (organizationName) {
      // Create new organization
      organization = organizationRepository.create({ name: organizationName });
      await organizationRepository.save(organization);
    } else {
      return res
        .status(400)
        .json({ error: "Organization details are required" });
    }

    // Create user and assign them to the organization
    const user = userRepository.create({
      username,
      password,
      role: existingOrganizationId ? "user" : "admin",
      organizations: [organization],
    });

    await userRepository.save(user);
    res.json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await userRepository.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isValid = bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
