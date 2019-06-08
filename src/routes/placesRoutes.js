const Places = require('../controllers/placesController');

module.exports = (router) => {
    router.get('/places', Places.getPlaces);
    router.post('/addPlace', Places.createPlace);
    router.get('/deletePlace/:id', Places.deletePlace);
    router.get('/editPlace/:id', Places.findPlaceById);
    router.post('/editPlace/:id', Places.updatePlace);
    router.get('/findPlaces', Places.getFindPlaces);
    router.get('/searchPlaces', Places.searchPlaces);
    router.get('/findPlace/:id', Places.findPlace)
}