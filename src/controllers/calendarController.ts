import { Request, Response } from "express";
import { createSharedCalendarEvent, createPersonalCalendarEvent } from "../services/googleCalendar";

export const createSharedEvent = async (req: Request, res: Response) => {
    const { summary, description, startTime, endTime, attendees } = req.body;

    if (!summary || !startTime || !endTime) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    const event = {
        summary,
        description,
        start: { dateTime: startTime, timeZone: "America/Guatemala" },
        end: { dateTime: endTime, timeZone: "America/Guatemala" },
        attendees: attendees || [],
    };

    try {
        const result = await createSharedCalendarEvent(event);
        res.status(201).json({ eventId: result.id });
    } catch (error) {
        // @ts-ignore
        res.status(500).json({ error: error.message });
    }
};

export const createPersonalEvent = async (req: Request, res: Response) => {
    const { accessToken, summary, description, startTime, endTime, attendees } = req.body;

    if (!accessToken || !summary || !startTime || !endTime) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    const event = {
        summary,
        description,
        start: { dateTime: startTime, timeZone: "America/Guatemala" },
        end: { dateTime: endTime, timeZone: "America/Guatemala" },
        attendees: attendees || [],
    };

    try {
        const result = await createPersonalCalendarEvent(accessToken, event);
        res.status(201).json({ eventId: result.id });
    } catch (error) {
        // @ts-ignore
        res.status(500).json({ error: error.message });
    }
};
