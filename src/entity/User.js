import { EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    username: {
      type: "varchar",
      unique: true,
    },
    password: {
      type: "varchar",
    },
    role: {
      type: "varchar",
    },
  },
  relations: {
    organization: {
      type: "many-to-one",
      target: "Organization",
      joinColumn: true,
      cascade: true,
    },
    tasks: {
      type: "one-to-many",
      target: "Task",
      inverseSide: "user",
    },
  },
});

export default User;
