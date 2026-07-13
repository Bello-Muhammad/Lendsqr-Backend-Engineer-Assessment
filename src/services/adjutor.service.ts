import axios from "axios";

export class AdjutorService {
    private static API_BASE_URL = process.env.ADJUOR_BASE_URL as string;
    private static API_KEY = process.env.ADJUTOR_API_KEY as string;

    public static async isBlackListed(email: string): Promise<boolean> {
        try {

            const response = await axios.get(`${this.API_BASE_URL}${email}`, {
                headers: { Authorization: `Bearer ${this.API_KEY}` }
            });

            return response.data?.status === "success" && response.data?.data !== null;

        } catch (error: any) {
            console.error("Error checking blacklist status:", error);
            if (error.response && error.response.status === 404) {
                return false;
            }
            throw new Error("Adjutor platform not reachable.");
        }
    }
}