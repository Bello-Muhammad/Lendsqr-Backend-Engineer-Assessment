import knex from "knex";
import knexfile from "../knexfile.js";

const config = knexfile as any;
let environment = process.env.NODE_ENV || "development";

export const db = knex(config[environment]);