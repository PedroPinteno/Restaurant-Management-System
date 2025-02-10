const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'El restaurante es obligatorio']
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: [true, 'El cliente es obligatorio']
    },
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table'
    },
    datetime: {
        startTime: {
            type: Date,
            required: [true, 'La hora de inicio es obligatoria']
        },
        endTime: {
            type: Date,
            required: [true, 'La hora de fin es obligatoria']
        },
        duration: {
            type: Number,
            default: 120 // duración en minutos
        }
    },
    party: {
        adults: {
            type: Number,
            required: [true, 'El número de adultos es obligatorio'],
            min: [1, 'Debe haber al menos un adulto']
        },
        children: {
            type: Number,
            default: 0,
            min: 0
        },
        totalGuests: {
            type: Number,
            required: [true, 'El número total de comensales es obligatorio']
        },
        specialRequirements: [{
            type: String,
            enum: ['high_chair', 'wheelchair_access', 'quiet_zone', 'birthday', 'anniversary']
        }]
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'],
        default: 'pending'
    },
    source: {
        type: String,
        enum: ['web', 'app', 'phone', 'walk_in'],
        required: true
    },
    notes: {
        customer: String,
        staff: String,
        kitchen: String
    },
    notifications: {
        confirmation: {
            sent: {
                type: Boolean,
                default: false
            },
            sentAt: Date
        },
        reminder: {
            sent: {
                type: Boolean,
                default: false
            },
            sentAt: Date
        }
    },
    payment: {
        required: {
            type: Boolean,
            default: false
        },
        deposit: {
            amount: Number,
            paid: {
                type: Boolean,
                default: false
            },
            paidAt: Date
        }
    },
    metadata: {
        createdBy: String,
        modifiedBy: String,
        cancelReason: String,
        waitingTime: Number // tiempo en lista de espera en minutos
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices
reservationSchema.index({ restaurant: 1, 'datetime.startTime': 1 });
reservationSchema.index({ customer: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ table: 1 });

// Middleware
reservationSchema.pre('save', function(next) {
    // Calcular total de invitados
    this.party.totalGuests = this.party.adults + this.party.children;
    
    // Calcular hora de fin basada en la duración
    if (this.datetime.startTime && this.datetime.duration) {
        this.datetime.endTime = new Date(
            this.datetime.startTime.getTime() + this.datetime.duration * 60000
        );
    }
    
    next();
});

// Virtuals
reservationSchema.virtual('isLate').get(function() {
    if (this.status !== 'confirmed') return false;
    return new Date() > this.datetime.startTime;
});

// Métodos
reservationSchema.methods.confirm = async function() {
    this.status = 'confirmed';
    
    // Enviar confirmación
    await this.sendConfirmation();
    
    return this.save();
};

reservationSchema.methods.cancel = async function(reason) {
    this.status = 'cancelled';
    this.metadata.cancelReason = reason;
    
    // Si hay mesa asignada, liberarla
    if (this.table) {
        const table = await this.model('Table').findById(this.table);
        if (table) await table.release();
    }
    
    // Actualizar estadísticas del cliente
    const customer = await this.model('Customer').findById(this.customer);
    if (customer) {
        customer.statistics.canceledReservations += 1;
        await customer.save();
    }
    
    return this.save();
};

reservationSchema.methods.markAsSeated = async function() {
    this.status = 'seated';
    
    if (this.table) {
        const table = await this.model('Table').findById(this.table);
        if (table) await table.occupy(this._id, this.party.totalGuests);
    }
    
    return this.save();
};

// Statics
reservationSchema.statics.findOverlapping = function(restaurantId, startTime, endTime) {
    return this.find({
        restaurant: restaurantId,
        'datetime.startTime': { $lt: endTime },
        'datetime.endTime': { $gt: startTime },
        status: { $in: ['confirmed', 'seated'] }
    });
};

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
