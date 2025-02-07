import {NextFunction, Router,Request, Response} from "express";
import {createEvent, deleteEvent, getEvent, updateEvent} from "../controllers/calendarController";
import { authorize } from "@epehc/sharedutilities/middlewares/authorize";
import { UserRole } from "@epehc/sharedutilities/enums/userRole";
import {authenticateJWT} from "../middlewares/authMiddleware";
import {body, param} from "express-validator";


const router = Router();

const logUserState = (req: Request, res: Response, next: NextFunction) => {
    console.log("User state after authenticateJWT:", req.user);
    next();
};

/**
 * @swagger
 * /shared/event:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recruiterEmail:
 *                 type: string
 *               summary:
 *                 type: string
 *               description:
 *                 type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               candidateEmail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/shared/event",
    authenticateJWT,
    logUserState,
    authorize([UserRole.Reclutador, UserRole.Admin]),
    [
        body("organizer").isEmail().withMessage("Recruiter email must be a valid email"),
        body("summary").notEmpty().withMessage("Summary is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("startTime").isISO8601().withMessage("Start time must be a valid ISO 8601 date"),
        body("endTime").isISO8601().withMessage("End time must be a valid ISO 8601 date"),
        body("attendee").optional().isEmail().withMessage("Candidate email must be a valid email"),
    ],
    createEvent);

/**
 * @swagger
 * /shared/event/{eventId}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.get(
    "/shared/event/:eventId",
    authenticateJWT,
    authorize([UserRole.Reclutador, UserRole.Admin]),
    [
        param("eventId").notEmpty().withMessage("Event ID is required"),
    ],
    getEvent
);

/**
 * @swagger
 * /shared/event/{eventId}:
 *   patch:
 *     summary: Update an event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recruiterEmail:
 *                 type: string
 *               summary:
 *                 type: string
 *               description:
 *                 type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               candidateEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.patch(
    "/shared/event/:eventId",
    authenticateJWT,
    authorize([UserRole.Reclutador, UserRole.Admin]),
    [
        param("eventId").notEmpty().withMessage("Event ID is required"),
        body("recruiterEmail").isEmail().withMessage("Recruiter email must be a valid email"),
        body("summary").optional().notEmpty().withMessage("Summary is required"),
        body("description").optional().notEmpty().withMessage("Description is required"),
        body("startTime").optional().isISO8601().withMessage("Start time must be a valid ISO 8601 date"),
        body("endTime").optional().isISO8601().withMessage("End time must be a valid ISO 8601 date"),
        body("candidateEmail").optional().isEmail().withMessage("Candidate email must be a valid email"),
    ],
    updateEvent
);

/**
 * @swagger
 * /shared/event/{eventId}:
 *   delete:
 *     summary: Delete an event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       500:
 *         description: Internal server error
 */
router.delete(
    "/shared/event/:eventId",
    authenticateJWT,
    authorize([UserRole.Reclutador, UserRole.Admin]),
    [
        param("eventId").notEmpty().withMessage("Event ID is required"),
    ],
    deleteEvent
);

export default router;
