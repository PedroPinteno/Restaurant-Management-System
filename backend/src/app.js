const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');

const AppError = require('./utils/appError');
const swaggerSpec = require('./config/swagger');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const tableRoutes = require('./routes/table.routes');
const customerRoutes = require('./routes/customer.routes');
const reservationRoutes = require('./routes/reservation.routes');
const analyticsRoutes = require('./routes/analytics.routes');

dotenv.config();

const app = express();

// Middleware de seguridad
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
    credentials: true
}));

// Logging en desarrollo
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Límite de solicitudes
const limiter = rateLimit({
    max: 100, // Límite de 100 solicitudes
    windowMs: 60 * 60 * 1000, // por hora
    message: 'Demasiadas solicitudes desde esta IP, por favor intente nuevamente en una hora'
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Sanitización de datos
app.use(mongoSanitize());
app.use(xss());

// Compresión de respuestas
app.use(compression());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Manejo de rutas no encontradas
app.all('*', (req, res, next) => {
    next(new AppError(`No se encontró ${req.originalUrl} en este servidor`, 404));
});

// Manejo global de errores
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // Error para producción
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            // Error de programación: no enviar detalles
            console.error('ERROR ', err);
            res.status(500).json({
                status: 'error',
                message: 'Algo salió mal'
            });
        }
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
            console.log(`Documentación API disponible en http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
