const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const deliverySchema = new Schema({
    idDelivery:{
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
        trim: true,
        default: 0
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
    idClient:{
        type: String,
        required: true
    },
    observation:{
        type: String,
        required: true,
        default: "None"
    },
    idPlace:{
        type: String,
        required: true
    }
    },{
    timestamps: true
});

module.exports = mongoose.model("Delivery", deliverySchema);