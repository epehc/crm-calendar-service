import { Router } from "express";
import { createEvent } from "../controllers/calendarController";

const router = Router();

router.post("/event", createEvent);

export default router;
