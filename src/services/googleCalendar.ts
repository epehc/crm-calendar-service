import { google } from "googleapis";
import { JWT } from "google-auth-library";

// Configure Service Account Auth for the Shared Calendar
const serviceAccountAuth = new JWT({
    keyFile: process.env.GOOGLE_CALENDAR_KEY_FILE!,
    scopes: ["https://www.googleapis.com/auth/calendar"],
});

// Configure OAuth for Individual Calendars
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.REDIRECT_URI!
);

const calendar = google.calendar({ version: "v3", auth: serviceAccountAuth });

export const createSharedCalendarEvent = async (event: any): Promise<any> => {
    try {
        const response = await calendar.events.insert({
            calendarId: process.env.SHARED_CALENDAR_ID!,
            requestBody: event,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to create shared calendar event: ${error.message}`);
    }
};

export const createPersonalCalendarEvent = async (
    accessToken: string,
    event: any
): Promise<any> => {
    try {
        oauth2Client.setCredentials({ access_token: accessToken });

        const personalCalendar = google.calendar({ version: "v3", auth: oauth2Client });
        const response = await personalCalendar.events.insert({
            calendarId: "primary",
            requestBody: event,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to create personal calendar event: ${error.message}`);
    }
};
