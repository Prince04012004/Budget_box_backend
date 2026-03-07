import mongoose from 'mongoose';

const categoryschema = {
    "food": { type: Number },
    "travelling": { type: Number },
    "others": { type: Number }
};

const debtschema = {
    "food": { type: Number, default: 0 },
    "travelling": { type: Number, default: 0 },
    "others": { type: Number, default: 0 }
};

const userSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "email": {
        type: String,
        required: true,
        unique: true
    },
    "password": {
        type: String,
        required: true
    },
    "monthlyincome": {
        type: Number,
        required: true
    },
    "dailybudget": {
        type: categoryschema,
        required: true
    },
    "budgetOver": {
        type: debtschema,
        default: {}
    },

    "wallet": {
        type: Number,
        default: 0
    },
    /* --- NEW FIELDS FOR CRON & ANIMATION --- */
    "savingsToday": {
        type: Number,
        default: 0
    },
    "lastAnimTime": {
        type: String, // Isme hum Date.now() ya "HH:mm" timestamp bhejenge
        default: ""
    },
    "isAnimationSeen": {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);