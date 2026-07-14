import type { Request, Response } from "express";
import { WalletService } from "../services/wallet.service.js";

export class WalletController {
    public static async createAccount(req: Request, res: Response) {
        try {
            const data = await WalletService.createAccount(req.body);

            return res.status(201).json({ success: true, message: data.message })
        } catch (error: any) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message })
            }

            return res.status(500).json({ error: "Internal server error." })
        }
    }

    public static async fundAccount(req: Request, res: Response) {
        const userId = req.user.id;
        const { amount } = req.body;

        try {
            const data = await WalletService.fundAccount(userId, amount);

            return res.status(200).json(data);
        } catch (error: any) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message })
            }

            return res.status(500).json({ error: "Internal server error." })
        }
    }

    public static async transferFunds(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            const { email, amount } = req.body;
            const data = await WalletService.transferFunds(userId, email, amount);

            return res.status(201).json({ success: true, message: data.message })
        } catch (error: any) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message })
            }

            return res.status(500).json({ error: "Internal server error." })
        }
    }

    public static async withdrawFunds(req: Request, res: Response) {
        const userId = req.user.id;
        const { amount } = req.body;

        try {

            const data = await WalletService.withdrawFunds(userId, amount);

            return res.status(201).json({ success: true, message: data.message })
        } catch (error: any) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message })
            }

            return res.status(500).json({ error: "Internal server error." })
        }
    }
}