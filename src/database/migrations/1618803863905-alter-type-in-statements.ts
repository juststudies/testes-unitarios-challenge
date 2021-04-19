import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class alterTypeInStatements1618803863905 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            'statements',
            'type',
            new TableColumn({
                name: "type",
                type: "enum",
                enum:["withdraw", "deposit", "transfer"]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('statements');
    }
}
