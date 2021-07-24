import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedDb1626807318922 implements MigrationInterface {
    name = 'SeedDb1626807318922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // tags table
        await queryRunner.query(
          `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`
        );

        // users table
        // password pass
        await queryRunner.query(
          `INSERT INTO users (username, email, password) VALUES ('test', 'test@gmail.com', '$2b$10$WweF21rLG6dxyTyfxbNtFONpU0mO/t.zzb03R11ARPIZGpwUiWPXO')`
        );

        // articles table
        await queryRunner.query(
          `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'first-article', 'First-article desc', 'First-article body', 'coffee,dragons', 1)`
        );

        await queryRunner.query(
          `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('second-article', 'second-article', 'Second-article desc', 'Second-article body', 'coffee,dragons', 1)`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}

}
