import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/modules/user/types/user-role.enum';

export class New1710774239406 implements MigrationInterface {
  private static ADMIN_EMAIL = 'admin@mail.com';
  private static SUPER_EMAIL = 'super@mail.com';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await bcrypt.hash('123', 10);
    queryRunner.query(`
      INSERT INTO "users"("email", "password") VALUES ('${New1710774239406.ADMIN_EMAIL}', '${hashedPassword}');
      INSERT INTO "user_role"("user_id", "role_id")
        VALUES (
          (SELECT "id" FROM "users" WHERE "email" = '${New1710774239406.ADMIN_EMAIL}'),
          (SELECT "id" FROM "roles" WHERE "role" = '${UserRole.admin}')
        );

      INSERT INTO "users"("email", "password") VALUES ('${New1710774239406.SUPER_EMAIL}', '${hashedPassword}');
      INSERT INTO "user_role"("user_id", "role_id")
        VALUES (
          (SELECT "id" FROM "users" WHERE "email" = '${New1710774239406.SUPER_EMAIL}'),
          (SELECT "id" FROM "roles" WHERE "role" = '${UserRole.admin}')
        );
      INSERT INTO "user_role"("user_id", "role_id")
        VALUES (
          (SELECT "id" FROM "users" WHERE "email" = '${New1710774239406.SUPER_EMAIL}'),
          (SELECT "id" FROM "roles" WHERE "role" = '${UserRole.editor}')
        );
      INSERT INTO "user_role"("user_id", "role_id")
        VALUES (
          (SELECT "id" FROM "users" WHERE "email" = '${New1710774239406.SUPER_EMAIL}'),
          (SELECT "id" FROM "roles" WHERE "role" = '${UserRole.viewer}')
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      DELETE FROM "users" WHERE "email" = '${New1710774239406.ADMIN_EMAIL}';
      DELETE FROM "users" WHERE "email" = '${New1710774239406.SUPER_EMAIL}';
      `);
  }
}
