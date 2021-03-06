const Users = require('../controllers/usersController');

module.exports = (router) => {
    router.get('/', Users.loginPage);
    router.get('/AdminHome', Users.adminPage);
    router.get('/register', Users.registerPage);
    router.get('/users',Users.findUser);
    router.get('/home',Users.userPage);
    router.get('/products/:id',Users.findProduct);
    router.get('/getProduct/:id',Users.getProduct);
    router.get('/addProductDelivery',Users.addProduct);
    router.get('/cart',Users.viewCart);
    router.get('/updateView', Users.updateView);
    router.get('/deleteUser/:id', Users.deleteUser);
    router.get('/addDelivery', Users.addDelivery);
    router.get('/nearbySearch/:id', Users.nearbysearch);
    router.get('/searchPlaces', Users.searchPlaces);
    router.get('/wishList/:id', Users.wishList);
    router.get('/getWish', Users.getWishList);
    router.get('/placeDetails/:id', Users.placeDetails);
    router.get('/getHistorial', Users.getHistorial);
    router.post('/login', Users.loginUser);
    router.post('/registerInfo', Users.createUser)
    
}