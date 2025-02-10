const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Manejo de excepciones no capturadas
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Cerrando...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: '.env' });
const app = require('./app');

// Conexión a la base de datos
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

// Manejo de rechazos de promesas no manejados
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Cerrando...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
