const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Restaurant Chain Manager API',
            version: '1.0.0',
            description: 'API para la gestión de cadenas de restaurantes',
            contact: {
                name: 'Soporte',
                email: 'support@restaurant-chain-manager.com'
            }
        },
        servers: [
            {
                url: process.env.API_URL || 'http://localhost:3000',
                description: 'Servidor de desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./src/routes/*.js'], // Rutas que contienen anotaciones
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
