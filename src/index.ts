import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import calendarRoutes from "./routes/calendarRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;

app.use(bodyParser.json());
app.use("/calendar", calendarRoutes);

app.listen(PORT, () => {
    console.log(`CRM Calendar Service running on port ${PORT}`);
});
