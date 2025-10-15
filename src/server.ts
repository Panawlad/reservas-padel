import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { prisma } from "./db";
import authRoutes from "./routes/auth.routes";
import clubRoutes from "./routes/club.routes"
import courtRoutes from "./routes/court.routes";
import scheduleRoutes from "./routes/schedule.routes";
import timeslotRoutes from "./routes/timeslot.routes";
import reservationRoutes from "./routes/reservation.routes";
import paymentRoutes from "./routes/payment.routes";
import commissionRoutes from "./routes/commission.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

app.use("/auth", authRoutes);

app.use("/clubs", clubRoutes);

app.use("/courts", courtRoutes);

app.use("/schedules", scheduleRoutes);

app.use("/timeslots", timeslotRoutes);

app.use("/reservations", reservationRoutes);

app.use("/payments", paymentRoutes);

app.use("/commissions", commissionRoutes);

// Ruta para el panel de administración
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Ruta raíz que redirige al panel de administración
app.get('/', (req, res) => {
    res.redirect('/admin');
});

// Rutas adicionales para el panel de administración
app.get('/api/stats', async (req, res) => {
    try {
        const [clubs, courts, reservations, users] = await Promise.all([
            prisma.club.count({ where: { isActive: true } }),
            prisma.court.count({ where: { isActive: true } }),
            prisma.reservation.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            }),
            prisma.user.count()
        ]);

        const todayRevenue = await prisma.reservation.aggregate({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                },
                status: 'PAID'
            },
            _sum: {
                totalCents: true
            }
        });

        res.json({
            clubs,
            courts,
            reservations,
            users,
            revenue: todayRevenue._sum.totalCents || 0
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    console.log(`🎨 Panel de administración: http://localhost:${PORT}/admin`);
});

// Cierre limpio para que el puerto no quede ocupado
const shutdown = () => {
    console.log("\n⏹️  Cerrando servidor...");
    server.close(() => {
        console.log("✅ Servidor cerrado correctamente");
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
