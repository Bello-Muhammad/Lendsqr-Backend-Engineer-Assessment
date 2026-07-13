import express from "express";
import * as dotenv from "dotenv";
import walletRoutes from "./routes/wallet.routes"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//routes entry
app.use('/api', walletRoutes);

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
});