const Product = require('../models/Products');

exports.addProductForm = async (req, res) => {
    const {id} = req.params;
    data = {
        id_place: id
    }
    res.render("AdminViews/addProductView", {data});    
}

exports.createProduct = async (req, res) => {
    const product = new Product(req.body);
    await product.save((err, product)=>{
        if(err) console.log(err);
        res.redirect("/products")
    })
}

exports.getProducts = async (req, res) => {
    const products = await Product.find();
    res.render("AdminViews/ProductsView", {products});
}

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    await Product.deleteOne({_id : id }, (err)=>{
        if(err){
            console.log(err);
        } else{
            res.redirect("/products");
        }
    });
}

exports.findProduct = async (req,res)=>{
    const {id} = req.params;
    await Product.findById({_id : id}, (err, product)=>{
        if (err){
            console.log(err);
        } else{
            res.render("AdminViews/UpdateProductView", {product});
        }
    });
}

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    await Product.update({_id : id}, req.body, (err, book)=>{
        if(err) console.log(err);
        res.redirect('/products')
    })
}