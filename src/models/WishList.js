const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const wishSchema = new Schema({
    oriPlace: {
        type: String,
        required: false, 
        trim: true
    },
    idPlace: {
        type: String,
        required: true, 
        trim: true
    },
    icon: {
        type: String,
        required: false, 
        trim: true
    },
    international_phone_number: {
        type: String,
        required: false, 
        trim: true
    },
    name: {
        type: String,
        required: false, 
        trim: true,
    },
    website: {
        type: String,
        required: false, 
        trim: true
    },    
    rating: {
        type: Number,
        required: false, 
        trim: true
    },
    distance:{
        type: Number,
        required: true
    },
    idClient:{
        type: String,
        required: true
    }
    },{
    timestamps: true
});

module.exports = mongoose.model("Wish", wishSchema);