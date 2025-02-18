import { Request, Response } from "express";
import { createEvent } from "../../src/controllers/calendarController";
import { validationResult } from "express-validator";
import { createCalendarEvent } from "../../src/services/googleCalendar";

jest.mock("../../src/services/googleCalendar", () => ({
  createCalendarEvent: jest.fn(),
}));

jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: () => true,
    array: () => [],
  })),
}));

const mockResponse = {
  json: jest.fn(),
  status: jest.fn(() => mockResponse),
  send: jest.fn(),
} as unknown as Response;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createEvent", () => {
  test("should create an event successfully", async () => {
    const fakeEvent = { id: "event123", summary: "Test Event" };
    (createCalendarEvent as jest.Mock).mockResolvedValue(fakeEvent);

    const req = {
      body: {
        summary: "Test Event",
        description: "This is a test event",
        startTime: "2025-02-18T10:00:00Z",
        endTime: "2025-02-18T11:00:00Z",
        organizer: "organizer@example.com",
        attendees: ["attendee@example.com"],
      },
    } as unknown as Request;

    await createEvent(req, mockResponse);

    expect(createCalendarEvent).toHaveBeenCalledWith("organizer@example.com", {
      summary: "Test Event",
      description: "This is a test event",
      startTime: "2025-02-18T10:00:00Z",
      endTime: "2025-02-18T11:00:00Z",
      attendees: ["attendee@example.com"],
    });
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ event: fakeEvent });
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid input" }],
    });

    const req = { body: {} } as unknown as Request;
    await createEvent(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid input" }],
    });
  });

  test("should return 400 if required fields are missing", async () => {
    const req = {
      body: {
        // missing summary, startTime, endTime and organizer
        description: "Missing required fields",
      },
    } as unknown as Request;
    await createEvent(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Missing required fields.",
    });
  });

  test("should return 500 if createCalendarEvent throws an error", async () => {
    const errorMessage = "Service error";
    (createCalendarEvent as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const req = {
      body: {
        summary: "Test Event",
        description: "This is a test event",
        startTime: "2025-02-18T10:00:00Z",
        endTime: "2025-02-18T11:00:00Z",
        organizer: "organizer@example.com",
        attendees: ["attendee@example.com"],
      },
    } as unknown as Request;

    await createEvent(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Error al crear evento: " + new Error(errorMessage).toString(),
    });
  });
});