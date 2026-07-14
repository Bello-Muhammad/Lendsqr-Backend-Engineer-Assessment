import knex from "knex";
import knexfile from "../knexfile.js";

const config = knexfile as any;
let environment = process.env.NODE_ENV || "development";

export const db = knex(config[environment]);

// import knex from "knex";
// // require the compiled knexfile (.js) so TypeScript doesn't try to include the .ts file outside rootDir
// const knexfile = require("../../knexfile.js") as any;
// const config = knexfile.default || knexfile;

// let environment = process.env.NODE_ENV || "development";

// export const db = knex(config[environment]);