import { createReadStream, createWriteStream } from "fs";
// import fs from "fs/promises";

import unzipper from "unzipper";

import { DATABASE_PATH, ZIP_PATH } from "../paths.js";

export async function initialize() {
  await new Promise((resolve, reject) => {
    const dest = createWriteStream(DATABASE_PATH);

    console.log("database copy start");
    createReadStream(ZIP_PATH)
      .pipe(unzipper.ParseOne())
      .pipe(dest)
      .on("error", (e) => {
        console.log(e.message);
        dest.destroy(e);
        reject(e);
      });

    dest
      .on("finish", () => {
        console.log("database copy finish");
        resolve();
      })
      .on("error", (e) => {
        console.log(e.message);
        reject(e);
      });
  });
}
