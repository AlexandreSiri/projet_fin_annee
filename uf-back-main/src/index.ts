import "dotenv/config"

import Server from "./server"
import authRoutes from "./routes/auth.routes"
import adminRoutes from "./routes/admin.routes"
import horseRoutes from "./routes/horse.routes"
import jobRoutes from "./routes/job.routes"
import appointmentRoutes from "./routes/appointment.routes"
import reservationRoutes from "./routes/reservation.routes"
import cdnRoutes from "./routes/cdn.routes"

const server = new Server(
    [
        authRoutes(),
        adminRoutes(),
        horseRoutes(),
        jobRoutes(),
        appointmentRoutes(),
        reservationRoutes(),
        cdnRoutes(),
    ],
    {
        port: 8080,
        logging: true,
    }
)
server.listen()
