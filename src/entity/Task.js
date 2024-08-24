import { EntitySchema } from "typeorm";

const Task = new EntitySchema({
  name: "Task",
  tableName: "tasks",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
    },
    description: {
      type: "varchar",
    },
    status: {
      type: "varchar",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User", // This must match the 'name' property of the User EntitySchema
      inverseSide: "tasks", // This must match the property name in the User entity that holds the relation
    },
  },
});

export default Task;
