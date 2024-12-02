import { Router } from "express";
import { createSharedEvent, createPersonalEvent } from "../controllers/calendarController";

const router = Router();

router.post("/shared/event", createSharedEvent);
router.post("/personal/event", createPersonalEvent);

export default router;
