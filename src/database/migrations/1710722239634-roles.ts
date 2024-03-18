import { UserRole } from 'src/modules/user/types/user-role.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class New1710722239634 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        INSERT INTO "roles"("role") VALUES ('${UserRole.admin}');
        INSERT INTO "roles"("role") VALUES ('${UserRole.viewer}');
        INSERT INTO "roles"("role") VALUES ('${UserRole.editor}');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DELETE FROM "roles";`);
  }
}
