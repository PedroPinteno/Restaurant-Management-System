const Restaurant = require('../models/restaurant.model');
const Table = require('../models/table.model');
const Employee = require('../models/employee.model');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllRestaurants = catchAsync(async (req, res) => {
    const { limit = 10, page = 1, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find()
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-schedule -features');

    const total = await Restaurant.countDocuments();

    res.status(200).json({
        status: 'success',
        results: restaurants.length,
        total,
        data: {
            restaurants
        }
    });
});

exports.getRestaurant = catchAsync(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.id)
        .populate('manager', 'personalInfo.firstName personalInfo.lastName')
        .populate('tables');

    if (!restaurant) {
        return next(new AppError('No se encontró el restaurante', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            restaurant
        }
    });
});

exports.createRestaurant = catchAsync(async (req, res) => {
    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            restaurant
        }
    });
});

exports.updateRestaurant = catchAsync(async (req, res, next) => {
    const restaurant = await Restaurant.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!restaurant) {
        return next(new AppError('No se encontró el restaurante', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            restaurant
        }
    });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
        return next(new AppError('No se encontró el restaurante', 404));
    }

    // Eliminar tablas asociadas
    await Table.deleteMany({ restaurant: req.params.id });

    // Actualizar empleados asociados
    await Employee.updateMany(
        { 'employment.restaurant': req.params.id },
        { 'employment.status': 'terminated', 'employment.endDate': new Date() }
    );

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getRestaurantTables = catchAsync(async (req, res, next) => {
    const tables = await Table.find({ restaurant: req.params.id })
        .sort('number');

    res.status(200).json({
        status: 'success',
        results: tables.length,
        data: {
            tables
        }
    });
});

exports.getRestaurantEmployees = catchAsync(async (req, res, next) => {
    const employees = await Employee.find({
        'employment.restaurant': req.params.id,
        'employment.status': 'active'
    }).select('-authentication');

    res.status(200).json({
        status: 'success',
        results: employees.length,
        data: {
            employees
        }
    });
});

exports.getRestaurantAnalytics = catchAsync(async (req, res, next) => {
    const { startDate, endDate, timeframe = 'daily' } = req.query;

    const analytics = await Analytics.find({
        restaurant: req.params.id,
        date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        },
        timeframe
    }).sort('date');

    res.status(200).json({
        status: 'success',
        results: analytics.length,
        data: {
            analytics
        }
    });
});

exports.getNearbyRestaurants = catchAsync(async (req, res, next) => {
    const { lat, lng, distance = 10000 } = req.query; // distance en metros

    const restaurants = await Restaurant.findNearby(
        [parseFloat(lng), parseFloat(lat)],
        distance
    );

    res.status(200).json({
        status: 'success',
        results: restaurants.length,
        data: {
            restaurants
        }
    });
});
