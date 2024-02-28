import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenUsers1709152296894 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "refresh_token" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_token"`);
  }
}
