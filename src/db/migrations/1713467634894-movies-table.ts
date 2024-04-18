import { MigrationInterface, QueryRunner } from "typeorm";

export class  MoviesTable1713467634894 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
        await queryRunner.query(
            `CREATE TABLE movies (
                  id uuid NOT NULL DEFAULT uuid_generate_v4(),
                  title varchar(256) NOT NULL,
                  director varchar(256) NOT NULL,
                  synopsis varchar(512) NOT NULL,
                  genre varchar(50),
                  release INTEGER NOT NULL CHECK (release >= 1900 AND release <= EXTRACT(YEAR FROM CURRENT_DATE)),
                  CONSTRAINT movies_pk PRIMARY KEY (id)
              );`,
          );

    }
    

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS movies;`);
    }

}
