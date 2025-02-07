/// <reference path="../node_modules/@epehc/sharedutilities/types/express.d.ts" />


import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import calendarRoutes from "./routes/calendarRoutes";
import {setupSwagger} from "./utils/swagger";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 4002;

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL, // Your frontend's URL
    credentials: true, // Allow credentials (cookies, headers)
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
setupSwagger(app);
app.use("/calendar", calendarRoutes);

app.listen(PORT, () => {
    console.log(`CRM Calendar Service running on port ${PORT}`);
});
