const Reservation = require('../models/reservation.model');
const Table = require('../models/table.model');
const Customer = require('../models/customer.model');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllReservations = catchAsync(async (req, res) => {
    const features = new APIFeatures(Reservation.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const reservations = await features.query
        .populate('customer', 'personalInfo.firstName personalInfo.lastName')
        .populate('table', 'number capacity');

    res.status(200).json({
        status: 'success',
        results: reservations.length,
        data: {
            reservations
        }
    });
});

exports.getReservation = catchAsync(async (req, res, next) => {
    const reservation = await Reservation.findById(req.params.id)
        .populate('customer')
        .populate('table')
        .populate('restaurant');

    if (!reservation) {
        return next(new AppError('No se encontró la reserva', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            reservation
        }
    });
});

exports.createReservation = catchAsync(async (req, res, next) => {
    // Verificar disponibilidad de mesa
    const { restaurant, datetime, party } = req.body;
    
    // Buscar mesa disponible
    const availableTables = await Table.findAvailable(
        restaurant,
        new Date(datetime.startTime),
        new Date(datetime.endTime),
        party.totalGuests
    );

    if (availableTables.length === 0) {
        return next(new AppError('No hay mesas disponibles para esta reserva', 400));
    }

    // Asignar la mesa más adecuada (la que mejor se ajusta al número de comensales)
    const table = availableTables.reduce((best, current) => {
        const bestDiff = Math.abs(best.capacity - party.totalGuests);
        const currentDiff = Math.abs(current.capacity - party.totalGuests);
        return currentDiff < bestDiff ? current : best;
    });

    // Crear la reserva
    const reservation = await Reservation.create({
        ...req.body,
        table: table._id
    });

    // Actualizar estadísticas del cliente
    await Customer.findByIdAndUpdate(req.body.customer, {
        $inc: { 'statistics.totalReservations': 1 },
        $set: { 'statistics.lastVisit': new Date() }
    });

    res.status(201).json({
        status: 'success',
        data: {
            reservation
        }
    });
});

exports.updateReservation = catchAsync(async (req, res, next) => {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
        return next(new AppError('No se encontró la reserva', 404));
    }

    // Si se está cambiando la hora o la mesa, verificar disponibilidad
    if (req.body.datetime || req.body.table) {
        const startTime = req.body.datetime?.startTime || reservation.datetime.startTime;
        const endTime = req.body.datetime?.endTime || reservation.datetime.endTime;
        const tableId = req.body.table || reservation.table;

        const isAvailable = await Table.findById(tableId).then(table => 
            table.isAvailable(new Date(startTime), new Date(endTime))
        );

        if (!isAvailable) {
            return next(new AppError('La mesa no está disponible para el nuevo horario', 400));
        }
    }

    // Actualizar la reserva
    const updatedReservation = await Reservation.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        status: 'success',
        data: {
            reservation: updatedReservation
        }
    });
});

exports.cancelReservation = catchAsync(async (req, res, next) => {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
        return next(new AppError('No se encontró la reserva', 404));
    }

    await reservation.cancel(req.body.reason);

    res.status(200).json({
        status: 'success',
        message: 'Reserva cancelada exitosamente'
    });
});

exports.checkIn = catchAsync(async (req, res, next) => {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
        return next(new AppError('No se encontró la reserva', 404));
    }

    if (reservation.status !== 'confirmed') {
        return next(new AppError('La reserva no está confirmada', 400));
    }

    await reservation.markAsSeated();

    res.status(200).json({
        status: 'success',
        message: 'Check-in realizado exitosamente',
        data: {
            reservation
        }
    });
});

exports.getReservationsByDate = catchAsync(async (req, res) => {
    const { date, restaurantId } = req.query;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const reservations = await Reservation.find({
        restaurant: restaurantId,
        'datetime.startTime': {
            $gte: startDate,
            $lte: endDate
        }
    }).populate('customer table');

    res.status(200).json({
        status: 'success',
        results: reservations.length,
        data: {
            reservations
        }
    });
});

exports.getAvailableTables = catchAsync(async (req, res) => {
    const { restaurantId, startTime, endTime, guests } = req.query;

    const availableTables = await Table.findAvailable(
        restaurantId,
        new Date(startTime),
        new Date(endTime),
        parseInt(guests)
    );

    res.status(200).json({
        status: 'success',
        results: availableTables.length,
        data: {
            tables: availableTables
        }
    });
});
