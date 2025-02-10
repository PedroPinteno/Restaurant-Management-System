const express = require('express');
const reservationController = require('../controllers/reservation.controller');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Obtener todas las reservas
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Fecha para filtrar reservas (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
router.use(protect);

router
    .route('/')
    .get(restrictTo('admin', 'manager', 'host'), reservationController.getAllReservations)
    .post(reservationController.createReservation);

router
    .route('/:id')
    .get(reservationController.getReservation)
    .patch(restrictTo('admin', 'manager', 'host'), reservationController.updateReservation);

router.post('/:id/cancel', reservationController.cancelReservation);
router.post('/:id/check-in', restrictTo('admin', 'manager', 'host'), reservationController.checkIn);

router.get('/by-date', reservationController.getReservationsByDate);
router.get('/available-tables', reservationController.getAvailableTables);

module.exports = router;
