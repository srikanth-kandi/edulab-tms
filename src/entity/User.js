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
    organizations: {
      type: "many-to-many",
      target: "Organization",
      inverseSide: "users",
      joinTable: {
        name: "user_organizations",
        joinColumn: {
          name: "user_id",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "organization_id",
          referencedColumnName: "id",
        },
      },
      cascade: true,
    },
  },
});

export default User;
