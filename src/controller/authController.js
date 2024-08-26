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
  const { username, password, orgName, existingOrgId } = req.body;

  try {
    let organization;
    let role;

    if (existingOrgId) {
      // Join existing organization
      organization = await organizationRepository.findOne({
        where: { id: existingOrgId },
      });

      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }

      // Check if the organization already has any users
      const userCount = await userRepository.count({
        where: { organization: { id: existingOrgId } },
      });

      // Assign role based on user count
      role = userCount === 0 ? "admin" : "user";
    } else if (orgName) {
      // orgName should contain alphabets, numbers and - only
      const orgNameRegex = /^[a-zA-Z0-9-]+$/;
      if (!orgNameRegex.test(orgName)) {
        return res.status(400).json({
          error:
            "Organization name should contain alphabets, numbers and - only",
        });
      }

      // Check if the organization name is already taken via case-insensitive search
      const existingOrg = await organizationRepository.findOne({
        where: { name: orgName },
      });

      if (existingOrg) {
        return res
          .status(400)
          .json({ error: "Organization name already exists" });
      }

      // Create a new organization
      organization = organizationRepository.create({ name: orgName });
      await organizationRepository.save(organization);

      // The first user in a new organization is the admin
      role = "admin";
    } else {
      return res
        .status(400)
        .json({ error: "Organization details are required" });
    }

    // Check if the username is already taken
    const existingUser = await userRepository.findOne({
      where: { username: username.toLowerCase() },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // check password has at least 8 characters with at least one number, one lowercase and one uppercase letter and one special character
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must contain at least 8 characters with at least one number, one lowercase and one uppercase letter and one special character",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and assign them to the organization
    const user = userRepository.create({
      username: username.toLowerCase(),
      password: hashedPassword,
      role: role,
      organization: organization,
    });

    await userRepository.save(user);
    res.json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await userRepository.findOne({
      where: { username: username.toLowerCase() },
      relations: ["organization"],
    });

    // Check if user exists
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the password is correct
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT token with the user's ID, role, and organization ID
    const token = jwt.sign(
      { id: user.id, role: user.role, orgId: user.organization.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Send the JWT token in the response
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
}
