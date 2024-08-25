export default class OrgUpdateAt1724607528208 {
  name = "OrgUpdateAt1724607528208";

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "updatedAt"`
    );
  }
}
