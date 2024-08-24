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
  },
  relations: {
    users: {
      type: "many-to-many",
      target: "User",
      joinTable: true,
    },
  },
});

export default Organization;
