import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./db";
import authRoutes from "./routes/auth.routes";
import clubRoutes from "./routes/club.routes"
import courtRoutes from "./routes/court.routes";
import scheduleRoutes from "./routes/schedule.routes";
import timeslotRoutes from "./routes/timeslot.routes";
import reservationRoutes from "./routes/reservation.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/clubs", clubRoutes);

app.use("/courts", courtRoutes);

app.use("/schedules", scheduleRoutes);

app.use("/timeslots", timeslotRoutes);

app.use("/reservations", reservationRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));
