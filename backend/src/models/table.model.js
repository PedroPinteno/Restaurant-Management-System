const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'El restaurante es obligatorio']
    },
    number: {
        type: Number,
        required: [true, 'El número de mesa es obligatorio'],
        min: [1, 'El número de mesa debe ser positivo']
    },
    capacity: {
        type: Number,
        required: [true, 'La capacidad es obligatoria'],
        min: [1, 'La capacidad debe ser al menos 1'],
        max: [12, 'La capacidad máxima es 12']
    },
    type: {
        type: String,
        enum: ['standard', 'high', 'booth', 'outdoor'],
        default: 'standard'
    },
    location: {
        zone: {
            type: String,
            enum: ['main', 'terrace', 'bar', 'private'],
            required: [true, 'La zona es obligatoria']
        },
        position: {
            x: Number,
            y: Number
        },
        features: [{
            type: String,
            enum: ['window', 'corner', 'near_bar', 'near_bathroom', 'near_entrance']
        }]
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'reserved', 'maintenance'],
        default: 'available'
    },
    qrCode: {
        type: String,
        unique: true
    },
    currentOccupancy: {
        startTime: Date,
        guests: Number,
        reservation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reservation'
        }
    },
    metadata: {
        averageOccupancyTime: {
            type: Number,
            default: 0
        },
        popularityScore: {
            type: Number,
            default: 0
        },
        lastMaintenance: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices
tableSchema.index({ restaurant: 1, number: 1 }, { unique: true });
tableSchema.index({ status: 1 });
tableSchema.index({ 'location.zone': 1 });

// Virtuals
tableSchema.virtual('currentReservation', {
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'table',
    justOne: true,
    match: { status: 'active' }
});

// Métodos
tableSchema.methods.isAvailable = function(startTime, endTime) {
    if (this.status === 'maintenance') return false;
    
    return this.model('Reservation')
        .findOne({
            table: this._id,
            startTime: { $lt: endTime },
            endTime: { $gt: startTime },
            status: { $in: ['confirmed', 'active'] }
        })
        .then(reservation => !reservation);
};

tableSchema.methods.occupy = async function(reservationId, guests) {
    this.status = 'occupied';
    this.currentOccupancy = {
        startTime: new Date(),
        guests,
        reservation: reservationId
    };
    return this.save();
};

tableSchema.methods.release = async function() {
    if (this.currentOccupancy?.startTime) {
        const duration = (new Date() - this.currentOccupancy.startTime) / (1000 * 60); // en minutos
        this.metadata.averageOccupancyTime = 
            (this.metadata.averageOccupancyTime + duration) / 2;
    }
    
    this.status = 'available';
    this.currentOccupancy = null;
    return this.save();
};

// Statics
tableSchema.statics.findAvailable = function(restaurantId, startTime, endTime, capacity) {
    return this.find({
        restaurant: restaurantId,
        status: 'available',
        capacity: { $gte: capacity }
    }).then(tables => {
        return Promise.all(
            tables.map(table => 
                table.isAvailable(startTime, endTime)
                    .then(available => available ? table : null)
            )
        ).then(tables => tables.filter(table => table));
    });
};

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
