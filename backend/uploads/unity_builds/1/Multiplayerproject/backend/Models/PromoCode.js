const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema(
    {
        reward: {type: String},
        exprirationDate: {type: Date},
    },
    { timestamps: true, collection: "promocode" }
);

module.exports = mongoose.model('PromoCode',promoCodeSchema);
