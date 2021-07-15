import { ConnectionOptions } from "typeorm";

export const config: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "mediumclone",
  password: "admin",
  database: "mediumclone",
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true
}
