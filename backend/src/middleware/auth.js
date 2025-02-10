const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Employee = require('../models/employee.model');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Obtener token
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('No has iniciado sesión', 401));
    }

    // 2) Verificar token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Verificar si el usuario existe
    const employee = await Employee.findById(decoded.id);
    if (!employee) {
        return next(new AppError('El usuario ya no existe', 401));
    }

    // 4) Verificar si el usuario cambió la contraseña después de emitir el token
    if (employee.authentication.passwordChangedAt) {
        const changedTimestamp = parseInt(
            employee.authentication.passwordChangedAt.getTime() / 1000,
            10
        );

        if (decoded.iat < changedTimestamp) {
            return next(new AppError('Usuario cambió la contraseña recientemente. Por favor, inicie sesión nuevamente', 401));
        }
    }

    // Guardar usuario en req
    req.user = employee;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.authentication.role)) {
            return next(new AppError('No tienes permiso para realizar esta acción', 403));
        }
        next();
    };
};

exports.checkPermissions = (...permissions) => {
    return (req, res, next) => {
        const hasPermission = permissions.every(permission =>
            req.user.authentication.permissions.includes(permission)
        );

        if (!hasPermission) {
            return next(new AppError('No tienes los permisos necesarios para realizar esta acción', 403));
        }
        next();
    };
};
