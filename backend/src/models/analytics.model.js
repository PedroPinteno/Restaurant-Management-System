const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeframe: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true
    },
    occupancy: {
        average: {
            type: Number,
            min: 0,
            max: 100
        },
        peakHours: [{
            hour: Number,
            percentage: Number
        }],
        byZone: [{
            zone: String,
            percentage: Number
        }]
    },
    reservations: {
        total: Number,
        confirmed: Number,
        cancelled: Number,
        noShow: Number,
        walkIn: Number,
        averagePartySize: Number,
        averageDuration: Number,
        popularTimeSlots: [{
            hour: Number,
            count: Number
        }]
    },
    tables: {
        totalAvailable: Number,
        averageTurnoverTime: Number,
        mostRequested: [{
            tableId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Table'
            },
            count: Number
        }],
        utilizationRate: Number
    },
    customers: {
        total: Number,
        new: Number,
        returning: Number,
        loyaltyProgram: {
            bronze: Number,
            silver: Number,
            gold: Number,
            platinum: Number
        },
        satisfaction: {
            average: Number,
            responses: Number
        }
    },
    revenue: {
        total: Number,
        perTable: Number,
        perCustomer: Number,
        byTimeSlot: [{
            hour: Number,
            amount: Number
        }]
    },
    waitingList: {
        averageWaitTime: Number,
        peakWaitTimes: [{
            hour: Number,
            minutes: Number
        }],
        totalParties: Number,
        conversionRate: Number
    },
    trends: {
        popularFeatures: [{
            feature: String,
            count: Number
        }],
        popularDays: [{
            day: String,
            score: Number
        }],
        seasonality: {
            type: Map,
            of: Number
        }
    }
}, {
    timestamps: true
});

// Índices
analyticsSchema.index({ restaurant: 1, date: 1, timeframe: 1 }, { unique: true });
analyticsSchema.index({ date: 1 });
analyticsSchema.index({ timeframe: 1 });

// Statics
analyticsSchema.statics.generateDailyAnalytics = async function(restaurantId, date) {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    // Obtener reservas del día
    const reservations = await mongoose.model('Reservation').find({
        restaurant: restaurantId,
        'datetime.startTime': { $gte: startOfDay, $lte: endOfDay }
    });
    
    // Calcular estadísticas
    const stats = {
        total: reservations.length,
        confirmed: reservations.filter(r => r.status === 'confirmed').length,
        cancelled: reservations.filter(r => r.status === 'cancelled').length,
        noShow: reservations.filter(r => r.status === 'no_show').length,
        walkIn: reservations.filter(r => r.source === 'walk_in').length
    };
    
    // Crear o actualizar analytics
    return this.findOneAndUpdate(
        {
            restaurant: restaurantId,
            date: startOfDay,
            timeframe: 'daily'
        },
        {
            $set: {
                'reservations.total': stats.total,
                'reservations.confirmed': stats.confirmed,
                'reservations.cancelled': stats.cancelled,
                'reservations.noShow': stats.noShow,
                'reservations.walkIn': stats.walkIn
            }
        },
        { upsert: true, new: true }
    );
};

analyticsSchema.statics.getRevenueAnalytics = async function(restaurantId, startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                restaurant: mongoose.Types.ObjectId(restaurantId),
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$revenue.total' },
                averagePerCustomer: { $avg: '$revenue.perCustomer' },
                totalCustomers: { $sum: '$customers.total' }
            }
        }
    ]);
};

analyticsSchema.statics.getOccupancyTrends = async function(restaurantId, timeframe) {
    return this.aggregate([
        {
            $match: {
                restaurant: mongoose.Types.ObjectId(restaurantId),
                timeframe: timeframe
            }
        },
        {
            $group: {
                _id: '$date',
                averageOccupancy: { $avg: '$occupancy.average' },
                peakHours: { $first: '$occupancy.peakHours' }
            }
        },
        {
            $sort: { '_id': 1 }
        }
    ]);
};

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
