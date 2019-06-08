const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const productSchema = new Schema({
    idProduct: {
        type: Number,
        required: true, 
        trim: true
    },
    name: {
        type: String,
        required: true, 
        trim: true
    },
    description: {
        type: String,
        required: true, 
        trim: true
    },
    price: {
        type: String,
        required: true, 
        trim: true
    },
    idPlace: {
        type: String,
        required: true, 
        trim: true
    }
    },{
    timestamps: true
});

module.exports = mongoose.model("products", productSchema);