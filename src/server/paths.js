import path from "path";

const ZIP_PATH = path.resolve(process.cwd(), "./database/seeds.zip");

const INITIAL_DATABASE_PATH = path.resolve(
  process.cwd(),
  "./database/seeds.sqlite",
);

const DATABASE_PATH = path.resolve(process.cwd(), "./database/database.sqlite");

export { DATABASE_PATH, INITIAL_DATABASE_PATH, ZIP_PATH };
