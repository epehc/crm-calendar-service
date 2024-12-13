import { JWT } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

// Initialize JWT for Google Calendar API
export const createGoogleAuth = (email: string) => {
    return new JWT({
        keyFile: process.env.GOOGLE_CALENDAR_KEY_FILE!,
        scopes: ["https://www.googleapis.com/auth/calendar"],
        subject: email, // Impersonate this user
    });
};
