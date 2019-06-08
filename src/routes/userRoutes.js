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
    router.post('/login', Users.loginUser);
    router.post('/registerInfo', Users.createUser)
    
}