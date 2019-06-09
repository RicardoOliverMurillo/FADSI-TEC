const Place = require('../models/Places');
var GoogleMapsAPI = require('googlemaps');
var https = require('https');

var publicConfig = {
    key: 'AIzaSyAKDFkr-WOl4mk3kNKAR57T7f51ZEgIiNg',
    stagger_time:       1000, // for elevationPath
    encode_polylines:   false,
    secure:             true
  };
  var gmAPI = new GoogleMapsAPI(publicConfig);

exports.createPlace = async (req, res) => {
    const PlacesFound = [];
    const place = new Place(req.body);
    await place.save((err, place)=>{
        if(err) console.log(err);
        res.render("AdminViews/SearchPlaceView", {PlacesFound});
    })
}

exports.getPlaces = async (req, res) => {
    const places= await Place.find();
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

exports.findPlaceById = async (req, res) => {
    const {id} = req.params;
    await Place.findById({_id : id}, (err, place)=>{
        if (err){
            console.log(err);
        } else{
            res.render("AdminViews/UpdatePlaceView", {place});
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

exports.findPlace = async (req,res)=>{
    const { id } = req.params;
    var urlBase = "https://maps.googleapis.com/maps/api/place/details/json?placeid="+ id ;
    var key = "&key=AIzaSyAKDFkr-WOl4mk3kNKAR57T7f51ZEgIiNg"
    var url = urlBase + key;
      console.log(url);
    https.get(url, function(response) {
      var body ='';
      response.on('data', function(chunk) {
        body += chunk;
      });
      response.on('end', function() {
        var places = JSON.parse(body);
        const placeData = {
            idPlace : places.result.place_id,
            latitude : places.result.geometry.location.lat,
            longitude : places.result.geometry.location.lng,
            address : places.result.formatted_address,
            category : places.result.types,
            phone : places.result.international_phone_number,
            rating : places.result.rating,
            schedule : places.result.opening_hours.weekday_text,
            website : places.result.website,
            name : places.result.name
        }
        res.render("AdminViews/AddPlaceView", {placeData})
      });
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
    //res.render('AddPlaceView', {placeData})
}

exports.getFindPlaces = async (req, res) => {
    const PlacesFound = [];
    res.render("AdminViews/SearchPlaceView", {PlacesFound});
}

exports.searchPlaces = function(req, res){
    var PlacesFound = [];
    if (req.query.address != ''){
        var urlBase = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+ req.query.address +"&key=";

        var url = urlBase + "AIzaSyAKDFkr-WOl4mk3kNKAR57T7f51ZEgIiNg";
        https.get(url, function(response) {
        var body ='';
        response.on('data', function(chunk) {
            body += chunk;
        });
        response.on('end', function() {
            var places = JSON.parse(body);
            for (var i = 0; i<(places.results).length; i++){
                const placeData = {
                    idPlace: places.results[i].place_id,
                    latitude: places.results[i].geometry.location.lat,
                    longitude: places.results[i].geometry.location.lng,
                    address: places.results[i].formatted_address,
                    category: places.results[i].types,
                    rating:places.results[i].rating,
                    name: places.results[i].name
                }
                PlacesFound.push(placeData);
            }
            res.render("AdminViews/SearchPlaceView", {PlacesFound})
        });
        }).on('error', function(e) {
        console.log("Got error: " + e.message);
        });
    }else if (req.query.latitude != '' && req.query.longitude != ''){
        var urlBase = "https://maps.googleapis.com/maps/api/place/textsearch/json?locationbias=circle:"+ req.query.latitude + ","+ req.query.longitude;
        var key = "&key=AIzaSyAKDFkr-WOl4mk3kNKAR57T7f51ZEgIiNg"
        var url = urlBase + key;
        https.get(url, function(response) {
        var body ='';
        response.on('data', function(chunk) {
            body += chunk;
        });
        response.on('end', function() {
            var places = JSON.parse(body);
            for (var i = 0; i<(places.results).length; i++){
                const placeData = {
                    idPlace: places.results[i].place_id,
                    latitude: places.results[i].geometry.location.lat,
                    longitude: places.results[i].geometry.location.lng,
                    address: places.results[i].formatted_address,
                    category: places.results[i].types,
                    rating:places.results[i].rating,
                    name: places.results[i].name
                }
                PlacesFound.push(placeData);
            }
            res.render("AdminViews/SearchPlaceView", {PlacesFound})
        });
        }).on('error', function(e) {
        console.log("Got error: " + e.message);
        });
        
    }
  };
