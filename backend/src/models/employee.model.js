const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
    personalInfo: {
        firstName: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'El apellido es obligatorio'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            unique: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
        },
        phone: {
            type: String,
            required: [true, 'El teléfono es obligatorio'],
            match: [/^[0-9]{9}$/, 'Formato de teléfono inválido']
        },
        dni: {
            type: String,
            required: [true, 'El DNI es obligatorio'],
            unique: true,
            match: [/^[0-9]{8}[A-Z]$/, 'DNI inválido']
        },
        birthDate: Date,
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String
        }
    },
    employment: {
        position: {
            type: String,
            required: [true, 'El puesto es obligatorio'],
            enum: ['manager', 'host', 'waiter', 'chef', 'kitchen_staff', 'bartender']
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: [true, 'El restaurante es obligatorio']
        },
        startDate: {
            type: Date,
            required: [true, 'La fecha de inicio es obligatoria']
        },
        endDate: Date,
        schedule: {
            monday: { start: String, end: String },
            tuesday: { start: String, end: String },
            wednesday: { start: String, end: String },
            thursday: { start: String, end: String },
            friday: { start: String, end: String },
            saturday: { start: String, end: String },
            sunday: { start: String, end: String }
        },
        status: {
            type: String,
            enum: ['active', 'on_leave', 'terminated'],
            default: 'active'
        }
    },
    authentication: {
        username: {
            type: String,
            required: [true, 'El nombre de usuario es obligatorio'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            select: false
        },
        role: {
            type: String,
            enum: ['admin', 'manager', 'staff'],
            default: 'staff'
        },
        permissions: [{
            type: String,
            enum: [
                'manage_employees',
                'manage_tables',
                'manage_reservations',
                'view_analytics',
                'manage_menu',
                'manage_customers'
            ]
        }],
        lastLogin: Date,
        resetPasswordToken: String,
        resetPasswordExpire: Date
    },
    performance: {
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        reviews: [{
            date: Date,
            rating: Number,
            comments: String,
            reviewer: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee'
            }
        }],
        incidents: [{
            date: Date,
            type: String,
            description: String,
            resolution: String
        }]
    },
    training: [{
        course: String,
        completionDate: Date,
        certificate: String,
        expiryDate: Date
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices
employeeSchema.index({ 'personalInfo.email': 1 }, { unique: true });
employeeSchema.index({ 'personalInfo.dni': 1 }, { unique: true });
employeeSchema.index({ 'authentication.username': 1 }, { unique: true });
employeeSchema.index({ 'employment.restaurant': 1 });
employeeSchema.index({ 'employment.position': 1 });

// Virtuals
employeeSchema.virtual('fullName').get(function() {
    return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Middleware
employeeSchema.pre('save', async function(next) {
    if (!this.isModified('authentication.password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.authentication.password = await bcrypt.hash(this.authentication.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Métodos
employeeSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.authentication.password);
};

employeeSchema.methods.hasPermission = function(permission) {
    return this.authentication.permissions.includes(permission);
};

employeeSchema.methods.addReview = function(rating, comments, reviewerId) {
    this.performance.reviews.push({
        date: new Date(),
        rating,
        comments,
        reviewer: reviewerId
    });
    
    // Actualizar rating promedio
    const totalRating = this.performance.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.performance.rating = totalRating / this.performance.reviews.length;
    
    return this.save();
};

// Statics
employeeSchema.statics.findByRestaurant = function(restaurantId) {
    return this.find({ 
        'employment.restaurant': restaurantId,
        'employment.status': 'active'
    });
};

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
