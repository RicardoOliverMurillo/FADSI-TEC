const Products = require('../controllers/productsController');

module.exports = (router) => {
    router.get('/products', Products.getProducts);
    router.get('/addProduct/:id', Products.addProductForm);
    router.post('/addProduct', Products.createProduct);
    router.get('/deleteProduct/:id', Products.deleteProduct);
    router.get('/editProduct/:id', Products.findProduct);
    router.post('/editProduct/:id', Products.updateProduct);
}