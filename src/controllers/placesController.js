const Place = require('../models/Places');

exports.createPlace = async (req, res) => {
    /*const place = new Place(req.body);
    await place.save((err, place)=>{
        if(err) console.log(err);
        res.redirect("/places")
    })*/
    console.log(req.body);
    console.log(parseFloat(req.body.longitude));
    
}

exports.getPlaces = async (req, res) => {
    const places = await Place.find();
    res.render("AdminViews/PlacesView", {places});
}

exports.deletePlace = async (req, res) => {
    const { id } = req.params;
    await Place.deleteOne({_id : id }, (err)=>{
        if(err){
            console.log(err);
        } else{
            res.redirect("/places");
        }
    });
}

exports.findPlace = async (req,res)=>{
    const {id} = req.params;
    await Place.findById({_id : id}, (err, place)=>{
        if (err){
            console.log(err);
        } else{
            res.render("AdminViews/updateBookView", {place});
        }
    });
}

exports.updatePlace = async (req, res) => {
    const { id } = req.params;
    await Place.update({_id : id}, req.body, (err, place)=>{
        if(err) console.log(err);
        res.redirect('/places')
    })
}