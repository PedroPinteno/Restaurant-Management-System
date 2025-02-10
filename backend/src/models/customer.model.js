const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema({
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
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
        },
        phone: {
            type: String,
            required: [true, 'El teléfono es obligatorio'],
            match: [/^[0-9]{9}$/, 'Formato de teléfono inválido']
        },
        birthDate: Date
    },
    authentication: {
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
            select: false
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        lastLogin: Date
    },
    preferences: {
        dietaryRestrictions: [{
            type: String,
            enum: ['vegetarian', 'vegan', 'gluten_free', 'lactose_free', 'nut_allergy', 'shellfish_allergy']
        }],
        seatingPreferences: [{
            type: String,
            enum: ['window', 'outdoor', 'quiet', 'booth', 'bar']
        }],
        favoriteRestaurants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant'
        }]
    },
    loyaltyProgram: {
        points: {
            type: Number,
            default: 0
        },
        tier: {
            type: String,
            enum: ['bronze', 'silver', 'gold', 'platinum'],
            default: 'bronze'
        },
        joinDate: {
            type: Date,
            default: Date.now
        }
    },
    statistics: {
        totalReservations: {
            type: Number,
            default: 0
        },
        canceledReservations: {
            type: Number,
            default: 0
        },
        noShows: {
            type: Number,
            default: 0
        },
        averageSpending: {
            type: Number,
            default: 0
        },
        lastVisit: Date
    },
    notifications: {
        email: {
            type: Boolean,
            default: true
        },
        sms: {
            type: Boolean,
            default: false
        },
        marketing: {
            type: Boolean,
            default: false
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'banned'],
        default: 'active'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices
customerSchema.index({ 'personalInfo.email': 1 }, { unique: true });
customerSchema.index({ 'personalInfo.phone': 1 });
customerSchema.index({ status: 1 });
customerSchema.index({ 'loyaltyProgram.points': -1 });

// Virtuals
customerSchema.virtual('fullName').get(function() {
    return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

customerSchema.virtual('reservations', {
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'customer'
});

// Middleware
customerSchema.pre('save', async function(next) {
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
customerSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.authentication.password);
};

customerSchema.methods.addLoyaltyPoints = function(points) {
    this.loyaltyProgram.points += points;
    
    // Actualizar tier basado en puntos
    if (this.loyaltyProgram.points >= 1000) this.loyaltyProgram.tier = 'platinum';
    else if (this.loyaltyProgram.points >= 500) this.loyaltyProgram.tier = 'gold';
    else if (this.loyaltyProgram.points >= 200) this.loyaltyProgram.tier = 'silver';
    
    return this.save();
};

// Statics
customerSchema.statics.findByEmail = function(email) {
    return this.findOne({ 'personalInfo.email': email.toLowerCase() });
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
