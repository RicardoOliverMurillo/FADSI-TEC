const Users = require('../controllers/usersController');

module.exports = (router) => {
    router.get('/', Users.loginPage);
    router.get('/AdminHome', Users.adminPage);
    router.get('/register', Users.registerPage);
    router.get('/users',Users.findUser);
    router.get('/updateView', Users.updateView);
    router.get('/deleteUser/:id', Users.deleteUser);
    router.post('/login', Users.loginUser);
    router.post('/registerInfo', Users.createUser)
    
}