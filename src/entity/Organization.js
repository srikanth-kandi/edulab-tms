import { EntitySchema } from "typeorm";

const Organization = new EntitySchema({
  name: "Organization",
  tableName: "organizations",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      unique: true,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    users: {
      type: "one-to-many",
      target: "User",
      inverseSide: "organization",
    },
  },
});

export default Organization;
