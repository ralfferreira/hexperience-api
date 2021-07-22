import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUser1626549778683 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'User',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",

          },
          { name: 'name', type: 'varchar', length: '100', isNullable: false },
          {
            name: 'email', type: 'varchar',
            length: '150',
            isNullable: false,
            isUnique: true
          },
          { name: 'password', type: 'varchar', length: '65', isNullable: false },
          { name: 'avatar', type: 'varchar', length: '100', isNullable: true },
          { name: 'phone_number', type: 'varchar', length: '20', isNullable: true },
          { name: 'bio', type: 'varchar', length: '350', isNullable: true },
          { name: 'is_blocked', type: 'boolean', isNullable: false, default: false },
          {
            name: 'type',
            type: 'enum',
            enum: ['user', 'host', 'admin'],
            enumName: 'typeEnum',
            isNullable: false,
            default: '"user"'
          },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('User');
  }

}
