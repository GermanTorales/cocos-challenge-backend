import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1723587806095 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL PRIMARY KEY,
                "email" VARCHAR NOT NULL,
                "accountnumber" VARCHAR NOT NULL UNIQUE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS "users";
    `);
  }
}
