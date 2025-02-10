const jwt = require('jsonwebtoken');
const Employee = require('../models/employee.model');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    user.authentication.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.login = catchAsync(async (req, res, next) => {
    const { username, password } = req.body;

    // 1) Verificar si username y password existen
    if (!username || !password) {
        return next(new AppError('Por favor proporcione usuario y contraseña', 400));
    }

    // 2) Verificar si el usuario existe y la contraseña es correcta
    const user = await Employee.findOne({ 'authentication.username': username })
        .select('+authentication.password');

    if (!user || !(await user.comparePassword(password))) {
        return next(new AppError('Usuario o contraseña incorrectos', 401));
    }

    // 3) Verificar si el usuario está activo
    if (user.employment.status !== 'active') {
        return next(new AppError('Su cuenta no está activa', 401));
    }

    // 4) Actualizar último login
    user.authentication.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // 5) Si todo está bien, enviar token
    createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Obtener usuario
    const user = await Employee.findById(req.user.id).select('+authentication.password');

    // 2) Verificar si la contraseña actual es correcta
    if (!(await user.comparePassword(req.body.currentPassword))) {
        return next(new AppError('Su contraseña actual es incorrecta', 401));
    }

    // 3) Actualizar contraseña
    user.authentication.password = req.body.password;
    user.authentication.passwordChangedAt = new Date();
    await user.save();

    // 4) Iniciar sesión, enviar JWT
    createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Obtener usuario basado en email
    const user = await Employee.findOne({ 'personalInfo.email': req.body.email });
    if (!user) {
        return next(new AppError('No existe un usuario con ese email', 404));
    }

    // 2) Generar token aleatorio
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Enviar email
    try {
        // TODO: Implementar envío de email
        const resetURL = `${req.protocol}://${req.get(
            'host'
        )}/api/v1/users/resetPassword/${resetToken}`;

        res.status(200).json({
            status: 'success',
            message: 'Token enviado al email',
            resetURL // Solo para desarrollo
        });
    } catch (err) {
        user.authentication.resetPasswordToken = undefined;
        user.authentication.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('Hubo un error enviando el email. Intente más tarde', 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Obtener usuario basado en token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await Employee.findOne({
        'authentication.resetPasswordToken': hashedToken,
        'authentication.resetPasswordExpire': { $gt: Date.now() }
    });

    // 2) Si el token no ha expirado y existe el usuario, establecer nueva contraseña
    if (!user) {
        return next(new AppError('Token inválido o ha expirado', 400));
    }

    user.authentication.password = req.body.password;
    user.authentication.resetPasswordToken = undefined;
    user.authentication.resetPasswordExpire = undefined;
    user.authentication.passwordChangedAt = new Date();
    await user.save();

    // 3) Actualizar passwordChangedAt

    // 4) Iniciar sesión, enviar JWT
    createSendToken(user, 200, res);
});
