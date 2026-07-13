import { Router } from "express";
import { fauxAuthMiddleware } from "../middleware/auth.middleware";
import { WalletController } from "../controllers/wallet.controller";

const router = Router();

router.post("/account/create", WalletController.createAccount);

// Protected endpoints
router.post("/wallet/fund", fauxAuthMiddleware, WalletController.fundAccount);
router.post("/wallet/transfer", fauxAuthMiddleware, WalletController.transferFunds);
router.post("/wallet/withdraw", fauxAuthMiddleware, WalletController.withdrawFunds);

export default router;