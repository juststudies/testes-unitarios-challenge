import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class addColumnSenderIdToStatements1618804285811 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'statements',
            new TableColumn({
                name: "sender_id",
                type: "uuid",
                isNullable: true
            }),
        );

        await queryRunner.createForeignKey(
            'statements',
            new TableForeignKey({
                name: "FKSenderUserStatement",
                columnNames:["sender_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
                onUpdate: "SET NULL"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('statements', 'FKSenderUserStatement');

        await queryRunner.dropTable('statements')
    }

}
