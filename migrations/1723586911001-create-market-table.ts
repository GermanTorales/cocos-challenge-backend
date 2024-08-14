import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMarketTable1723586911001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "marketdata" (
                "id" SERIAL PRIMARY KEY,
                "instrumentid" INT,
                "high" NUMERIC(10, 2),
                "low" NUMERIC(10, 2),
                "open" NUMERIC(10, 2),
                "close" NUMERIC(10, 2),
                "previousclose" NUMERIC(10, 2),
                "date" DATE,
                FOREIGN KEY (instrumentid) REFERENCES instruments(id)
            );

        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS "marketdata";
    `);
  }
}
