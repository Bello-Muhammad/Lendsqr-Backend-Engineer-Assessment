import { db } from "../database/database.js";
import { AdjutorService } from "./adjutor.service.js";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";


interface userData {
    name: string;
    email: string;
    password: string;
}

export class WalletService {
    private static async hashPassword(password: string) {
        return await bcrypt.hash(password, 8);
    };

    public static async createAccount(user: userData) {
        const { name, email, password } = user;

        if (!name || !email || !password) {
            throw new Error("All input are required: name, email, and password")
        }

        if (name && (typeof (name) !== "string") || email && (typeof (email) !== "string") || password && (typeof (password) !== "string")) {
            throw new Error("All input are required: name, email, and password should be string.")
        }

        const isBlacklisted = await AdjutorService.isBlackListed(email);

        if (isBlacklisted) {
            throw new Error("Registration blocked: Email flags Karma ecosystem warnings")
        }

        const hashed = await this.hashPassword(password);

        await db.transaction(async (trx) => {
            const [userId] = await trx("users").insert({
                name,
                email,
                password: hashed,
            });

            await trx("wallets").insert({
                userId: userId,
            })
        });

        return { message: "Account created successfully." }
    }

    public static async fundAccount(userId: number, amount: number) {
        if (!amount || amount <= 0) {
            throw new Error("Invalid amount entered");
        }

        await db.transaction(async (trx) => {
            const wallet = await trx("wallets").where({ userId: userId }).forUpdate().first();

            if (!wallet) throw new Error("User wallet not found.");

            console.log(wallet)
            const newBalance = Number(wallet.balance) + Number(amount);
            await trx("wallets").where({ id: wallet.id }).update({ balance: newBalance });

            await trx("transactions").insert({
                walletId: wallet.id,
                type: "DEPOSIT",
                amount,
                reference: `DEP-${uuidv4()}`
            });
        });

        return { message: "Account fund successfully." };
    }

    public static async transferFunds(senderId: number, email: string, amount: number) {
        if (!amount || amount <= 0) {
            throw new Error("Invalid amount");
        }

        await db.transaction(async (trx) => {
            const recipient = await trx('users').where({ email }).first();

            if (!recipient) {
                throw new Error("Target recipient not found.");
            }
            const senderWallet = await trx("wallets").where({ userId: senderId }).forUpdate().first();
            const recipientWallet = await trx("wallets").where({ userId: recipient.id }).forUpdate().first();

            if (Number(senderWallet.balance) < amount) {
                throw new Error("Insufficient balance");
            }

            await trx("wallets").where({ id: senderWallet.id }).update({
                balance: Number(senderWallet.balance) - Number(amount)
            });

            await trx("wallets").where({ id: recipientWallet.id }).update({
                balance: Number(recipientWallet.balance) + Number(amount)
            });

            const reference = uuidv4();

            await trx("transactions").insert([
                {
                    walletId: senderWallet.id,
                    type: "TRANSFER_OUT",
                    amount,
                    referenceWalletId: recipientWallet.id,
                    reference: `TX-OUT-${reference}`
                },
                {
                    walletId: recipientWallet.id,
                    type: "TRANSFER_IN",
                    amount,
                    referenceWalletId: senderWallet.id,
                    reference: `TX-IN-${reference}`
                }
            ]);
        });

        return { message: "Transfer successful" };
    }

    public static async withdrawFunds(userId: number, amount: number) {
        await db.transaction(async (trx) => {
            const wallet = await trx("wallets").where({ userId: userId }).forUpdate().first();

            if (Number(wallet.balance) < amount) {
                throw new Error("insufficient funds");
            }

            await trx("wallets").where({ id: wallet.id }).update({
                balance: Number(wallet.balance) - Number(amount)
            });

            await trx("transactions").insert({
                walletId: wallet.id,
                type: "WITHDRAWAL",
                amount,
                reference: `WTH-${uuidv4()}`
            });
        });

        return { message: "Withdrawal completed successfully." };
    }
}