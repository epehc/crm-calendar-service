import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import calendarRoutes from "./routes/calendarRoutes";
import {setupSwagger} from "./utils/swagger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;

app.use(bodyParser.json());
setupSwagger(app);
app.use("/calendar", calendarRoutes);

app.listen(PORT, () => {
    console.log(`CRM Calendar Service running on port ${PORT}`);
});
