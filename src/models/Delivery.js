const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const deliverySchema = new Schema({
    idDelivery: {
        type: String,
        required: false, 
        trim: true
    },
    product: {
        type: Array,
        trim: true
    },
    total: {
        type: Number,
        trim: true
    },
    date: {
        type: Date,
        required: true, 
        trim: true
    },
    state: {
        type: String,
        required: true, 
        trim: true,
        default: "Register"
    },
    },{
    timestamps: true
});

module.exports = mongoose.model("Delivery", deliverySchema);