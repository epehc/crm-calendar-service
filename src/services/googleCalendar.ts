import { google } from "googleapis";
import { createGoogleAuth } from "./googleAuth";

export const createCalendarEvent = async (
    recruiterEmail: string,
    eventDetails: {
        summary: string;
        description: string;
        startTime: string;
        endTime: string;
        candidateEmail?: string;
    }
): Promise<any> => {
    try {
        // Create auth client impersonating the recruiter
        const auth = createGoogleAuth(recruiterEmail);

        // Initialize Google Calendar API
        const calendar = google.calendar({ version: "v3", auth });

        // Create the event
        const response = await calendar.events.insert({
            calendarId: process.env.SHARED_CALENDAR_ID!,
            requestBody: {
                summary: eventDetails.summary,
                description: eventDetails.description,
                start: { dateTime: eventDetails.startTime, timeZone: "America/Guatemala" },
                end: { dateTime: eventDetails.endTime, timeZone: "America/Guatemala" },
                attendees: [
                    { email: recruiterEmail }, // Recruiter as an invitee
                    ...(eventDetails.candidateEmail ? [{ email: eventDetails.candidateEmail }] : []), // Candidate if provided
                ],
            },
        });

        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to create calendar event: ${error.message}`);
    }
};
