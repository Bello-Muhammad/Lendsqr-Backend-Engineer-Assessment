import express from "express";
import * as dotenv from "dotenv";
import walletRoutes from "./routes/wallet.routes.js"
import { db } from "./database/database.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//routes entry
app.use('/api', walletRoutes);

//automatic database migration
await db.migrate.latest().then(() => {
    console.log("Database migration completed successfully.");
}).catch((error: Error) => {
    console.log("Database migration failed:", error);
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
});