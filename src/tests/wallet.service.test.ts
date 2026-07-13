import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { WalletService } from "../services/wallet.service";
import { db } from "../database/database";
import { AdjutorService } from "../services/adjutor.service";

const mockedDb = db as any;
const mockedAdjutor = AdjutorService as any;

jest.mock("../database/database", () => ({
    db: {
        transaction: jest.fn(),
    },
}));

jest.mock("../services/adjutor.service", () => ({
    AdjutorService: {
        isBlackListed: jest.fn(),
    },
}));

jest.mock("bcrypt", () => ({
    hash: jest.fn(async () => "hashed-password"),
}));

jest.mock("uuid", () => ({
    v4: jest.fn(() => "test-uuid"),
}));

describe("WalletService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("creates an account after blacklist check and password hashing", async () => {
        mockedAdjutor.isBlackListed.mockResolvedValue(false);

        const transaction = jest.fn(async (callback: any) => {
            const trx = (table: string) => ({
                insert: jest.fn(async () => [42]),
            });
            return callback(trx);
        });

        mockedDb.transaction.mockImplementation(transaction);

        const result = await WalletService.createAccount({
            name: "Jane",
            email: "jane@example.com",
            password: "secret123",
        });

        expect(mockedAdjutor.isBlackListed).toHaveBeenCalledWith("jane@example.com");
        expect(result).toEqual({ message: "Account created successfully." });
    });

    it("rejects fund requests with invalid amounts", async () => {
        await expect(WalletService.fundAccount(1, 0)).rejects.toThrow("Invalid amount entered");
        await expect(WalletService.fundAccount(1, -5)).rejects.toThrow("Invalid amount entered");
    });

    it("rejects transfers when the sender has insufficient funds", async () => {
        const transaction = jest.fn(async (callback: any) => {
            const trx = (table: string) => {
                if (table === "users") {
                    return {
                        where: jest.fn(() => ({
                            first: jest.fn(async () => ({ id: 2, email: "bob@example.com" })),
                        })),
                    };
                }

                return {
                    where: jest.fn(() => ({
                        forUpdate: () => ({
                            first: jest.fn(async () => ({ id: 10, balance: 20 })),
                        }),
                    })),
                };
            };
            return callback(trx);
        });

        mockedDb.transaction.mockImplementation(transaction);

        await expect(WalletService.transferFunds(1, "bob@example.com", 50)).rejects.toThrow("Insufficient balance");
    });

    it("completes a withdrawal when funds are available", async () => {
        const transaction = jest.fn(async (callback: any) => {
            const trx = (table: string) => {
                if (table === "transactions") {
                    return { insert: jest.fn(async () => [1]) };
                }

                return {
                    where: jest.fn(() => ({
                        forUpdate: () => ({
                            first: jest.fn(async () => ({ id: 10, balance: 100 })),
                        }),
                        update: jest.fn(async () => 1),
                    })),
                };
            };
            return callback(trx);
        });

        mockedDb.transaction.mockImplementation(transaction);

        const result = await WalletService.withdrawFunds(1, 40);

        expect(result).toEqual({ message: "Withdrawal completed successfully." });
    });
});
