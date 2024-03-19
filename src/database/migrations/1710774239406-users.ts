import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../modules/user/types/user-role.enum';

export class New1710774239406 implements MigrationInterface {
  private static ADMIN_EMAIL = 'admin@mail.com';
  private static SUPER_EMAIL = 'super@mail.com';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await bcrypt.hash('123', 10);
    queryRunner.query(`
      INSERT INTO "test_task20240318"."users"("email", "password") VALUES ('${New1710774239406.ADMIN_EMAIL}', '${hashedPassword}');
      INSERT INTO "test_task20240318"."user_role"("user_id", "role_id")
        VALUES (
          (SELECT "id" FROM "test_task20240318"."users" WHERE "email" = '${New1710774239406.ADMIN_EMAIL}'),
          (SELECT "id" FROM "test_task20240318"."roles" WHERE "role" = '${UserRole.admin}')
        );

      INSERT INTO "test_task20240318"."users"("email", "password") VALUES ('${New1710774239406.SUPER_EMAIL}', '${hashedPassword}');
      INSERT INTO "test_task20240318"."user_role"("user_id", "role_id")
        VALUES (
          (SELECT "id" FROM "test_task20240318"."users" WHERE "email" = '${New1710774239406.SUPER_EMAIL}'),
          (SELECT "id" FROM "test_task20240318"."roles" WHERE "role" = '${UserRole.admin}')
        );
      INSERT INTO "test_task20240318"."user_role"("user_id", "role_id")
        VALUES (
          (SELECT "id" FROM "test_task20240318"."users" WHERE "email" = '${New1710774239406.SUPER_EMAIL}'),
          (SELECT "id" FROM "test_task20240318"."roles" WHERE "role" = '${UserRole.editor}')
        );
      INSERT INTO "test_task20240318"."user_role"("user_id", "role_id")
        VALUES (
          (SELECT "id" FROM "test_task20240318"."users" WHERE "email" = '${New1710774239406.SUPER_EMAIL}'),
          (SELECT "id" FROM "test_task20240318"."roles" WHERE "role" = '${UserRole.viewer}')
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      DELETE FROM "test_task20240318"."users" WHERE "email" = '${New1710774239406.ADMIN_EMAIL}';
      DELETE FROM "test_task20240318"."users" WHERE "email" = '${New1710774239406.SUPER_EMAIL}';
      `);
  }
}
