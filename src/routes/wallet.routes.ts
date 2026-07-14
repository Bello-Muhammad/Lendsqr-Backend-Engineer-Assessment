import { Router } from "express";
import { fauxAuthMiddleware } from "../middleware/auth.middleware.js";
import { WalletController } from "../controllers/wallet.controller.js";

const router = Router();

router.post("/account/create", WalletController.createAccount);

// Protected endpoints
router.post("/wallet/fund", fauxAuthMiddleware, WalletController.fundAccount);
router.post("/wallet/transfer", fauxAuthMiddleware, WalletController.transferFunds);
router.post("/wallet/withdraw", fauxAuthMiddleware, WalletController.withdrawFunds);

export default router;