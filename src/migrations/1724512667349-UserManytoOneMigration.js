export default class UserManytoOneMigration1724512667349 {
  name = "UserManytoOneMigration1724512667349";

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE "users" ADD "organizationId" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_f3d6aea8fcca58182b2e80ce979" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_f3d6aea8fcca58182b2e80ce979"`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "organizationId"`);
  }
}
