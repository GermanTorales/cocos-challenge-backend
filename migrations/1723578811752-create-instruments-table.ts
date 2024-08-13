import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInstrumentsTable1723578811752 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "instruments" (
                "id" SERIAL NOT NULL,
                "ticker" VARCHAR NOT NULL UNIQUE,
                "name" VARCHAR NOT NULL,
                "type" VARCHAR NOT NULL,
                CONSTRAINT "PK_id" PRIMARY KEY ("id")
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS "instruments";
        `);
  }
}
