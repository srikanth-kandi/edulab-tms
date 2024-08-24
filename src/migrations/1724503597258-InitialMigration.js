export default class InitialMigration1724503597258 {
  name = "InitialMigration1724503597258";

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "status" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "organizations" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9b7ca6d30b94fef571cff876884" UNIQUE ("name"), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_organizations" ("user_id" integer NOT NULL, "organization_id" integer NOT NULL, CONSTRAINT "PK_f143fa57706c0fb840301ad7049" PRIMARY KEY ("user_id", "organization_id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6881b23cd1a8924e4bf61515fb" ON "user_organizations" ("user_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9dae16cdea66aeba1eb6f6ddf2" ON "user_organizations" ("organization_id") `
    );
    await queryRunner.query(
      `CREATE TABLE "organizations_users_users" ("organizationsId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_e094eef91bc145eb947ac50081d" PRIMARY KEY ("organizationsId", "usersId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_44f70c1007e4ecf7cff380da65" ON "organizations_users_users" ("organizationsId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aa1a9a9f720bd04d9447ff9cc6" ON "organizations_users_users" ("usersId") `
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_166bd96559cb38595d392f75a35" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organizations" ADD CONSTRAINT "FK_6881b23cd1a8924e4bf61515fbb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organizations" ADD CONSTRAINT "FK_9dae16cdea66aeba1eb6f6ddf29" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "organizations_users_users" ADD CONSTRAINT "FK_44f70c1007e4ecf7cff380da659" FOREIGN KEY ("organizationsId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "organizations_users_users" ADD CONSTRAINT "FK_aa1a9a9f720bd04d9447ff9cc66" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "organizations_users_users" DROP CONSTRAINT "FK_aa1a9a9f720bd04d9447ff9cc66"`
    );
    await queryRunner.query(
      `ALTER TABLE "organizations_users_users" DROP CONSTRAINT "FK_44f70c1007e4ecf7cff380da659"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organizations" DROP CONSTRAINT "FK_9dae16cdea66aeba1eb6f6ddf29"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_organizations" DROP CONSTRAINT "FK_6881b23cd1a8924e4bf61515fbb"`
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_166bd96559cb38595d392f75a35"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_aa1a9a9f720bd04d9447ff9cc6"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_44f70c1007e4ecf7cff380da65"`
    );
    await queryRunner.query(`DROP TABLE "organizations_users_users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9dae16cdea66aeba1eb6f6ddf2"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6881b23cd1a8924e4bf61515fb"`
    );
    await queryRunner.query(`DROP TABLE "user_organizations"`);
    await queryRunner.query(`DROP TABLE "organizations"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
