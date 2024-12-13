import { Request, Response } from "express";
import { createCalendarEvent } from "../services/googleCalendar";

export const createEvent = async (req: Request, res: Response) => {
    const { recruiterEmail, summary, description, startTime, endTime, candidateEmail } = req.body;

    if (!recruiterEmail || !summary || !startTime || !endTime) {
        res.status(400).json({ error: "Missing required fields." });
        return
    }

    try {
        const event = await createCalendarEvent(recruiterEmail, {
            summary,
            description,
            startTime,
            endTime,
            candidateEmail,
        });

        res.status(201).json({ event });
    } catch (error) {
        // @ts-ignore
        res.status(500).json({ error: error.message });
    }
};
