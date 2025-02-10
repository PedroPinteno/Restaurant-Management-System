const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxLength: [50, 'El nombre no puede tener más de 50 caracteres']
    },
    address: {
        street: {
            type: String,
            required: [true, 'La calle es obligatoria'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'La ciudad es obligatoria'],
            trim: true
        },
        state: {
            type: String,
            required: [true, 'La provincia es obligatoria'],
            trim: true
        },
        zipCode: {
            type: String,
            required: [true, 'El código postal es obligatorio'],
            match: [/^[0-9]{5}$/, 'Código postal inválido']
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    },
    contact: {
        phone: {
            type: String,
            required: [true, 'El teléfono es obligatorio'],
            match: [/^[0-9]{9}$/, 'Formato de teléfono inválido']
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
        }
    },
    schedule: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },
    capacity: {
        type: Number,
        required: [true, 'La capacidad es obligatoria'],
        min: [1, 'La capacidad debe ser al menos 1']
    },
    status: {
        type: String,
        enum: ['active', 'closed', 'maintenance'],
        default: 'active'
    },
    features: [{
        type: String,
        enum: ['parking', 'terrace', 'wifi', 'accessibility', 'air_conditioning', 'events']
    }],
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'El manager es obligatorio']
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices
restaurantSchema.index({ 'address.coordinates': '2dsphere' });
restaurantSchema.index({ name: 1 });
restaurantSchema.index({ status: 1 });

// Virtuals
restaurantSchema.virtual('tables', {
    ref: 'Table',
    localField: '_id',
    foreignField: 'restaurant'
});

restaurantSchema.virtual('employees', {
    ref: 'Employee',
    localField: '_id',
    foreignField: 'restaurant'
});

restaurantSchema.virtual('reservations', {
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'restaurant'
});

// Métodos
restaurantSchema.methods.isOpen = function() {
    const now = new Date();
    const day = now.toLocaleLowerCase();
    if (!this.schedule[day]) return false;

    const currentTime = now.toTimeString().slice(0,5);
    return currentTime >= this.schedule[day].open && 
           currentTime <= this.schedule[day].close;
};

// Statics
restaurantSchema.statics.findNearby = function(coords, maxDistance) {
    return this.find({
        'address.coordinates': {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: coords
                },
                $maxDistance: maxDistance
            }
        }
    });
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
