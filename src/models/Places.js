const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

const placeSchema = new Schema({
    idPlace: {
        type: String,
        required: true, 
        trim: true,
        unique: true
    },
    latitude: {
        type: Number,
        //required: true, 
        trim: true
    },
    longitude: {
        type: Number,
        //required: true, 
        trim: true
    },
    address: {
        type: String,
        required: true, 
        trim: true
    },
    category: {
        type: String,
        required: true, 
        trim: true,
    },
    image: {
        type: String,
        //required: true, 
        trim: true
    },
    phone: {
        type: String,
        //required: true, 
        trim: true
    },    
    rating: {
        type: String,
        required: true, 
        trim: true
    },
    schedule:{
        type: String,
        //required: true, 
        trim: true
    },
    website:{
        type: String,
        //required: true, 
        trim: true
    },
    name:{
        type: String,
        required: true, 
        trim: true
    },
    description:{
        type: String,
        //required: true, 
        trim: true
    },
    qDealer:{
        type: String,
        //required: true, 
        trim: true
    }
    },{
    timestamps: true
});

module.exports = mongoose.model("Places", placeSchema);