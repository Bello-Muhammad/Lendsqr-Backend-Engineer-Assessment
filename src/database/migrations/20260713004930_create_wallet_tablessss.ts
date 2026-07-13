import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
     await knex.schema.createTable("wallets", (table) => {
    table.increments("id").primary();
    table.integer("userId").unsigned().notNullable().unique();
    table.decimal("balance", 15, 4).notNullable().defaultTo(0.0000);
    table.string("currency").notNullable().defaultTo("NGN");
    table.timestamps(true, true);
    table.foreign("userId").references("id").inTable("users").onDelete("CASCADE");
  });

  await knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table.integer("walletId").unsigned().notNullable();
    table.enum("type", ["DEPOSIT", "WITHDRAWAL", "TRANSFER_OUT", "TRANSFER_IN"]).notNullable();
    table.decimal("amount", 15, 4).notNullable();
    table.integer("referenceWalletId").unsigned().nullable();
    table.string("reference").notNullable().unique();
    table.timestamps(true, true);
    table.foreign("walletId").references("id").inTable("wallets").onDelete("CASCADE");
    table.foreign("referenceWalletId").references("id").inTable("wallets").onDelete("SET NULL");
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transactions");
  await knex.schema.dropTableIfExists("wallets");
}

