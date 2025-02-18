jest.mock(
    "../../src/middlewares/authMiddleware",
    () => ({
        authenticateJWT: (req: any, res: any, next: any) => next(),
    })
);

jest.mock(
    "../../node_modules/@epehc/sharedutilities/middlewares/authorize",
    () => ({
        authorize: () => (req: any, res: any, next: any) => next(),
    })
);

import * as calendarController from "../../src/controllers/calendarController";
// Stub controller function to simulate event creation.
jest.spyOn(calendarController, "createEvent").mockImplementation(async (req, res) => {
    res.status(201).json({
        event: {
            id: "event123",
            summary: req.body.summary,
            description: req.body.description,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            organizer: req.body.organizer,
            attendees: req.body.attendees,
        },
    });
});

import request from "supertest";
import express from "express";
import calendarRoutes from "../../src/routes/calendarRoutes";

const app = express();
app.use(express.json());
app.use(calendarRoutes);

describe("Calendar Routes Integration Tests", () => {
    test("POST /shared/event should create a new event and return it", async () => {
        const newEvent = {
            summary: "Integration Test Event",
            description: "This event is created during integration test",
            startTime: "2025-02-18T10:00:00Z",
            endTime: "2025-02-18T11:00:00Z",
            organizer: "organizer@example.com",
            attendees: ["attendee@example.com"],
        };

        const res = await request(app).post("/shared/event").send(newEvent);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            event: { id: "event123", ...newEvent },
        });
    });
});