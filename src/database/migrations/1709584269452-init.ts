import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1709584269452 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" SERIAL PRIMARY KEY,
      "email" VARCHAR(64) NOT NULL,
      "password" VARCHAR(72) NOT NULL,
      "utc_created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
    CONSTRAINT "uq__users__email" UNIQUE ("email")
    );
    
    CREATE TABLE IF NOT EXISTS "roles" (
      "id" SERIAL PRIMARY KEY,
      "role" VARCHAR(16) NOT NULL,
      "utc_created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
    CONSTRAINT "uq__roles__role" UNIQUE ("role")
    );

    CREATE TABLE IF NOT EXISTS "user_role" (
      "id" SERIAL PRIMARY KEY,
      "user_id" INT NOT NULL,
      "role_id" INT NOT NULL,
      "utc_created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
    CONSTRAINT "uq__user_role" UNIQUE ("user_id", "role_id"),
    CONSTRAINT "fk__user_role__user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "fk__user_role__role" FOREIGN KEY ("role_id") REFERENCES "roles" ("id")
    );

    CREATE TABLE IF NOT EXISTS "articles" (
      "id" SERIAL PRIMARY KEY,
      "user_id" INT NOT NULL,
      "title" TEXT,
      "text" TEXT,
      "utc_created_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
      "utc_updated_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
    CONSTRAINT "fk__atricles__user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
    );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    DROP TABLE "articles";
    DROP TABLE "user_role";
    DROP TABLE "roles";
    DROP TABLE "users";
    `);
  }
}
