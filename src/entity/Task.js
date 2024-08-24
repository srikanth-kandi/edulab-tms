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
      type: "varchar", // e.g., 'pending', 'in-progress', 'completed'
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      inverseSide: "tasks",
      onDelete: "CASCADE",
    },
  },
});

export default Task;
