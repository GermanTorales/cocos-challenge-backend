import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderTable1723588249825 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" SERIAL PRIMARY KEY,
                "instrumentid" INT,
                "userid" INT,
                "size" INT,
                "price" NUMERIC(10, 2),
                "type" VARCHAR(10),
                "side" VARCHAR(10),
                "status" VARCHAR(20),
                "datetime" TIMESTAMP,
                FOREIGN KEY (instrumentid) REFERENCES instruments(id),
                FOREIGN KEY (userid) REFERENCES users(id)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS "orders";
    `);
  }
}
