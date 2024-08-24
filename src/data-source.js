import { DataSource } from "typeorm";
import { config } from "dotenv";

config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  entities: ["src/entity/**/*.js"],
  migrations: ["src/migrations/*.js"],
});

export default AppDataSource;
