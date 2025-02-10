const express = require('express');
const restaurantController = require('../controllers/restaurant.controller');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Obtener todos los restaurantes
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número de resultados por página
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *     responses:
 *       200:
 *         description: Lista de restaurantes
 */
router.get('/', restaurantController.getAllRestaurants);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Obtener un restaurante por ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del restaurante
 *       404:
 *         description: Restaurante no encontrado
 */
router.get('/:id', restaurantController.getRestaurant);

// Rutas protegidas
router.use(protect);

router
    .route('/')
    .post(restrictTo('admin'), restaurantController.createRestaurant);

router
    .route('/:id')
    .patch(restrictTo('admin', 'manager'), restaurantController.updateRestaurant)
    .delete(restrictTo('admin'), restaurantController.deleteRestaurant);

router.get('/:id/tables', restaurantController.getRestaurantTables);
router.get('/:id/employees', restrictTo('admin', 'manager'), restaurantController.getRestaurantEmployees);
router.get('/:id/analytics', restrictTo('admin', 'manager'), restaurantController.getRestaurantAnalytics);
router.get('/nearby', restaurantController.getNearbyRestaurants);

module.exports = router;
