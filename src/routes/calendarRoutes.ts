import {NextFunction, Router,Request, Response} from "express";
import {createEvent, deleteEvent, getEvent, updateEvent} from "../controllers/calendarController";
import { authorize } from "@epehc/sharedutilities/middlewares/authorize";
import { UserRole } from "@epehc/sharedutilities/enums/userRole";
/*
import { authenticateJWT } from "@epehc/sharedutilities/middlewares/authMiddleware"
*/
import {authenticateJWT} from "../middlewares/authMiddleware";


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
router.post("/shared/event", authenticateJWT, logUserState, authorize([UserRole.Reclutador, UserRole.Admin]), createEvent);

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
    deleteEvent
);

export default router;
