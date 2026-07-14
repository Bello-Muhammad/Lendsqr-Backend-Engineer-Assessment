import knex from "knex";
import knexfile from "../knexfile.js";

const config = knexfile as any;
let environment = process.env.NODE_ENV || "development";

console.log(`Using ${environment} environment for database connection.`);

export const db = knex(config[environment]);