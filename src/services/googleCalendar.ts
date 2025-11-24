import { google } from "googleapis";
import { createGoogleAuth } from "./googleAuth";

// Get Event
export const getCalendarEvent = async (recruiterEmail: string, eventId: string): Promise<any> => {
    try {
        const auth = createGoogleAuth(recruiterEmail);
        const calendar = google.calendar({ version: "v3", auth });

        const response = await calendar.events.get({
            calendarId: process.env.SHARED_CALENDAR_ID!,
            eventId,
        });

        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to get calendar event: ${error.message}`);
    }
};

export const updateCalendarEvent = async (
    recruiterEmail: string,
    eventId: string,
    eventDetails: {
        summary: string;
        description: string;
        startTime: string;
        endTime: string;
        candidateEmail?: string;
    }
): Promise<any> => {
    try {
        const auth = createGoogleAuth(recruiterEmail);
        const calendar = google.calendar({ version: "v3", auth });

        const response = await calendar.events.patch({
            calendarId: process.env.SHARED_CALENDAR_ID!,
            eventId,
            requestBody: {
                ...(eventDetails.summary && { summary: eventDetails.summary }),
                ...(eventDetails.description && { description: eventDetails.description }),
                ...(eventDetails.startTime && { start: { dateTime: eventDetails.startTime, timeZone: "America/Guatemala" } }),
                ...(eventDetails.endTime && { end: { dateTime: eventDetails.endTime, timeZone: "America/Guatemala" } }),
                ...(eventDetails.candidateEmail && { attendees: [/*{ email: recruiterEmail },*/ { email: eventDetails.candidateEmail }] }),
            },
        });

        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to update calendar event: ${error.message}`);
    }
};

export const createCalendarEvent = async (
    organizer: string,
    eventDetails: {
        summary: string;
        description: string;
        startTime: string;
        endTime: string;
        attendees?: string | string[];
    }
): Promise<any> => {
    try {
        // Create auth client impersonating the recruiter
        const auth = createGoogleAuth(organizer);

        // Initialize Google Calendar API
        const calendar = google.calendar({ version: "v3", auth });

        const attendeesEmails = Array.isArray(eventDetails.attendees)
            ? eventDetails.attendees
            : eventDetails.attendees
                ? [eventDetails.attendees]
                : [];

        const event = {
            summary: eventDetails.summary,
            description: eventDetails.description,
            start: { dateTime: eventDetails.startTime, timeZone: "America/Guatemala" },
            end: { dateTime: eventDetails.endTime, timeZone: "America/Guatemala" },
            attendees: attendeesEmails.map(email => ({ email })),
            conferenceData: {
                createRequest: {
                    requestId: Math.random().toString(36).substring(2, 15),
                    conferenceSolutionKey: {type: "hangoutsMeet"},
                }
            }
        }

        // Create the event
        const response = await calendar.events.insert({
            calendarId: process.env.SHARED_CALENDAR_ID!,
            requestBody: event,
            conferenceDataVersion: 1, //To create a Google Meet link
            sendUpdates: "all",
        });


        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to create calendar event: ${error.message}`);
    }
};
// Update Event

// Delete Event
export const deleteCalendarEvent = async (recruiterEmail: string, eventId: string): Promise<boolean> => {
    try {
        const auth = createGoogleAuth(recruiterEmail);
        const calendar = google.calendar({ version: "v3", auth });

        await calendar.events.delete({
            calendarId: process.env.SHARED_CALENDAR_ID!,
            eventId,
        });

        return true;
    } catch (error: any) {
        throw new Error(`Failed to delete calendar event: ${error.message}`);
    }
};
