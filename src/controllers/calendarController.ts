import {/*Request,*/ Response } from "express";
import {Request} from "@epehc/sharedutilities/types/express";
import {
    createCalendarEvent,
    deleteCalendarEvent,
    getCalendarEvent,
    updateCalendarEvent
} from "../services/googleCalendar";
import {validationResult} from "express-validator";
import logger from "../utils/logger";

// Read Event
export const getEvent = async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const recruiterEmail = req.user?.email;

    try {
        const event = await getCalendarEvent(<string>recruiterEmail, eventId);
        if (!event) {
            logger.error("No se pudo en contrar el evento");
            res.status(404).json({ error: "Event not found." });
            return;
        }
        logger.info('Evento obtenido cargado: ', event);
        res.status(200).json({ event });
    } catch (error) {
        logger.error('Error al obtener evento: ', error);
        res.status(500).json({ error: 'Error al obtener evento: ' + error });
    }
};



export const createEvent = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Error al validar crear evento: ', errors);
        res.status(400).json({ errors: errors.array() });
    }

    const {summary, description, startTime, endTime, organizer, attendees } = req.body;

    logger.info('Creando evento: ', req.body);
    logger.info('Organizador: ', organizer, ', summary: ', summary, ', startTime: ', startTime, ', endTime: ', endTime);

    if (!organizer || !summary || !startTime || !endTime) {
        logger.error('Error al crear evento debido a la falta de parametros: ', errors);
        res.status(400).json({ error: "Missing required fields." });
        return
    }

    try {
        const event = await createCalendarEvent(<string>organizer, {
            summary,
            description,
            startTime,
            endTime,
            attendees,
        });

        logger.info('Evento creado: ', event);
        res.status(201).json({ event });
    } catch (error) {
        logger.error('Error al crear evento: ', error);
        res.status(500).json({ error: 'Error al crear evento: ' + error });
    }
};

// Update Event
export const updateEvent = async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const recruiterEmail = req.user?.email;
    const {summary, description, startTime, endTime, candidateEmail } = req.body;

    try {
        const updatedEvent = await updateCalendarEvent(<string>recruiterEmail, eventId , {
            summary,
            description,
            startTime,
            endTime,
            candidateEmail,
        });

        if (!updatedEvent) {
            logger.error("No se pudo en contrar el evento");
            res.status(404).json({ error: "Event not found." });
            return;
        }

        logger.info('Evento actualizado: ', updatedEvent);
        res.status(200).json({ event: updatedEvent });
    } catch (error) {
        logger.error('Error al actualizar evento: ', error);
        res.status(500).json({ error: 'Error al actualizar evento: ' + error });
    }
};

// Delete Event
export const deleteEvent = async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const recruiterEmail = req.user?.email;

    try {
        const deleted = await deleteCalendarEvent(<string>recruiterEmail, eventId);
        if (!deleted) {
            logger.error("Event not found.");
            res.status(404).json({ error: "Event not found." });
            return;
        }

        logger.info('Evento eliminado: ', eventId);
        res.status(204).send();
    } catch (error) {
        logger.error('Error al eliminar evento: ', error);
        res.status(500).json({ error: 'Error al eliminar evento: ' + error });
    }
};