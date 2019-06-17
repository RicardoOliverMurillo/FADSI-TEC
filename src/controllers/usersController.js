//variables generales
const Users = require('../models/users');
const Place = require('../models/Places');
const Delivery = require('../models/Delivery');
const Product = require('../models/Products');
const Wish = require('../models/WishList');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey123456';
var GoogleMapsAPI = require('googlemaps');
var https = require('https');
//variables globales
var userGlobal = "";
var pedido = [];
var place;

//Controlador para abrir la vista de administrador
exports.adminPage = (req, res) =>{
    res.render('AdminViews/mainView')
}
//Controlador para abrir la vista de usuario
exports.userPage = async (req, res) =>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    const places = await Place.find();
    res.render('userViews/userView', {dataUser, places})
}
//Controlador para abrir la vista de log in
exports.loginPage = (req, res) =>{
    res.render('index')
}
//Controlador para abrir la vista de registrar usuario
exports.registerPage = (req, res) =>{
    res.render('UserViews/registerView')
}
//Controlador para crear un usuario nuevo
exports.createUser = async (req, res) => {
    const newUser = {
        idUser : req.body.idUser,
        name : req.body.name,
        last_name : req.body.last_name,
        birth : req.body.birth,
        email : req.body.email,
        phone_number : req.body.phone_number,
        userName : req.body.userName,
        password : bcrypt.hashSync(req.body.password)
    }
    const user = new Users(newUser);
    await user.save((err, user) =>{  
        if(err && err.code === 11000) return res.status(409).send('Email already exists');
        if (err) return res.status(500).send(err);
        expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: user.id}, SECRET_KEY, {
            expiresIn: expiresIn
        });
        const dataUser = {
            name: user.name,
            email: user.email,
            accessToken: accessToken,
            expiresIn: expiresIn
        }
        res.render('index', {dataUser});
    })
}
//Controlador para validad el usuario y contrase;a del usuario
exports.loginUser = async(req, res) =>{
    const userData = {
        userName : req.body.userName,
        password : req.body.password
    }
    Users.findOne({userName: userData.userName}, (err, user)=>{
        if (err) return res.status(500).send('Server error');
        if (!user) {
            //email doesn't exist
            console.log("no hay usuario")
            res.status(500).send({message: 'something is wrong'});
        } else{
            Place.find(function(err, places) {
                if (err) throw err;
            const resultPassword = bcrypt.compareSync(userData.password, user.password);
            if(resultPassword){
                const expiresIn = 20 * 60 * 60;
                const accessToken = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: expiresIn});
                
                const dataUser = {
                    name: user.name,
                    email: user.email,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                }
                //Redireccionamiento a ClientViewa
                if(user.role === 'client'){
                    userGlobal = dataUser.email;
                    
                    res.render('UserViews/userView', {dataUser, places})  
                } else {
                    userGlobal = dataUser.email;
                    nameGlobal = "admin";
                    res.render('AdminViews/mainView')
                }
                
            }else{
                //password wrong

                res.status(409).send({message: 'something is wrong'});
            }
            }) 
        }
    })
}
//Controlador para encontrar un usuario
exports.findUser = async (req, res) =>{
    await Users.findOne({email: req.body.email}, (err, user) =>{
        if (err){
            console.log(err)
        } else{
            res.send({user});
        }
    })
}
//Controlador para actualizar la informacion de un usuario
exports.updateUserInfo = async (req, res) =>{
    const newUser = {
        idUser : req.body.idUser,
        name : req.body.name,
        last_name : req.body.last_name,
        birth : req.body.birth,
        email : req.body.email,
        phone_number : req.body.phone_number,
        userName : req.body.userName
    }
    const { id } = req.params;
    if(req.body.password == ""){
        await Users.update({_id : id}, {idUser:newUser.idUser,name:newUser.name,type:newUser.type,place:newUser.place,email:newUser.email, phone_number:newUser.phone_number}, (err)=>{
            if(err) console.log(err);
            res.redirect('/home')
        })
    }else{
        const dataUser1 = await Users.find({email : userGlobal});
        const dataUser = dataUser1[0];
        const resultPassword = bcrypt.compareSync(req.body.password, dataUser.password);
            if(resultPassword){
                const password = bcrypt.hashSync(req.body.passwordNew)
                await Users.update({_id : id}, {idUser:newUser.idUser,name:newUser.name,type:newUser.type,place:newUser.place,email:newUser.email, phone_number:newUser.phone_number, password:password}, (err)=>{
                    if(err) console.log(err);
                    res.redirect('/home')
                })
            }
    }
    
}
//Controlador para mostrar la vista de actualizar usuario
exports.updateView = async (req, res) =>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    res.render('UserViews/userInfo', {dataUser})
}
//Controlador para eliminar un usuario
exports.deleteUser = async (req,res) =>{
    const {id} = req.params;
    await Users.remove({_id:id});
    res.redirect("/");
}
//Controlador para encontrar los productos de un restaurante en particular
exports.findProduct = async (req,res)=>{
    const {id} = req.params;
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    await Product.find({idPlace : id}, (err, product)=>{
        if (err){
            console.log(err);
        } else{
            res.render("UserViews/productsByPlace", {product, dataUser});
        }
    });
}
//Controlador para mostrar la ventana de agregar producto
exports.getProduct = async(req,res)=>{
    const {id} = req.params;
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    const productInfo = await Product.find({idProduct:id});
    res.render("UserViews/getProduct", {productInfo, dataUser});
}
//Controlador que agrega los productos al array
exports.addProduct =async (req,res)=>{
    const data = await Product.find({idProduct:req.query.idProduct});

    product = {
        idProduct: req.query.idProduct,
        name: data[0].name,
        qProduct: req.query.qProduct,
        note: req.query.note,
        price: data[0].price * parseInt(req.query.qProduct),
        idPlace: data[0].idPlace
    }
    pedido.push(product);

    res.redirect("/home");
}
//Controlador para mostrar el carrito de compras
exports.viewCart = async (req,res)=>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    var total = 0;
    for(var i = 0; i<pedido.length;i++){
        total = total+ pedido[i].price; 
    }
    res.render("userViews/viewCart",{pedido, dataUser, total});
}
//Controlador para insertar un pedido
exports.addDelivery = async(req, res)=>{
    var total = 0;
    var idPlace = "";
    for(var i = 0; i<pedido.length;i++){
        total = total+ pedido[i].price; 
        idPlace = pedido[i].idPlace;
    }

    const date = new Date();
    const data = {
        product : pedido,
        total : total,
        date : date,
        idPlace : idPlace,
        idClient : userGlobal,
    }
    const delivery = new Delivery(data);
    await delivery.save();
    pedido = [];
    res.redirect("/home");
}
//Controlador para buscar abrir la ventana de lugares cerca
exports.nearbysearch = async(req, res)=>{
    const {id} = req.params;
    const PlacesFound = [];
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    await Place.findById({_id : id}, (err, place)=>{
        if (err){
            console.log(err);
        } else{
            res.render("userViews/searchPlaces", {place,dataUser, PlacesFound});
        }
    });
}
//Controlador para obtener la informacion de un lugar cercano en radios
exports.searchPlaces = function(req, res){
    var PlacesFound = [];
    var urlBase = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
    var key = "AIzaSyAKDFkr-WOl4mk3kNKAR57T7f51ZEgIiNg";
    var location = req.query.latitude+","+req.query.longitude
    var radius = req.query.radius
    var type = "restaurant"

    var url = urlBase+location+"&radius="+radius+"&types="+type+"&key="+key;
    
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
        Users.find({email : userGlobal}, function(err, data) {
            if (err) throw err;
            place ={
                latitude: req.query.latitude,
                longitude: req.query.longitude,
                radius : req.query.radius,
                name : req.query.name
            }
            const dataUser = data[0];
        res.render("userViews/searchPlaces", {PlacesFound,dataUser, place})
        })
    });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
  };

  //Controlador para ver la informacion detallada del lugar cercano en radios
  exports.placeDetails = (req, res)=>{
    const {id} = req.params;
    var urlBase = "https://maps.googleapis.com/maps/api/place/details/json?placeid=";
    var key = "AIzaSyAKDFkr-WOl4mk3kNKAR57T7f51ZEgIiNg";
    var fields = "&fields=name,rating,international_phone_number,website,icon";
    var url = urlBase+id+fields+"&key="+key;
    
    https.get(url, function(response) {
    var body ='';
    response.on('data', function(chunk) {
        body += chunk;
    });
    response.on('end', function() {
        var places = JSON.parse(body);
        const placeData = {
            idPlace: id,
            icon: places.result.icon,
            international_phone_number: places.result.international_phone_number,
            name: places.result.name,
            website: places.result.website,
            rating:places.result.rating,
        }
        Users.find({email : userGlobal}, function(err, data) {
            if (err) throw err;
            const dataUser = data[0];
        res.render("userViews/infoPlace", {placeData,dataUser})
        })
    });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
  };

  //Controlador para agregar a la lista de deseos
  exports.wishList = async (req, res)=>{
    const {id} = req.params;
    var urlBase = "https://maps.googleapis.com/maps/api/place/details/json?placeid=";
    var key = "AIzaSyAKDFkr-WOl4mk3kNKAR57T7f51ZEgIiNg";
    var fields = "&fields=name,rating,international_phone_number,website,icon";
    var url = urlBase+id+fields+"&key="+key;
    
    https.get(url, function(response) {
    var body ='';
    response.on('data', function(chunk) {
        body += chunk;
    });
    response.on('end', function() {
        var places = JSON.parse(body);
        const placeData = {
            oriPlace: place.name,
            idPlace: id,
            icon: places.result.icon,
            international_phone_number: places.result.international_phone_number,
            name: places.result.name,
            website: places.result.website,
            rating:places.result.rating,
            distance : place.radius,
            idClient : userGlobal
        }
        const newWish = new Wish(placeData);
        newWish.save();
        res.redirect("/home");
    });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
  };

  //Controlador para mostar toda la lista de deseos
  exports.getWishList = async (req, res)=>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    const allWishes = await Wish.find({idClient: dataUser.email});
    res.render("userViews/wishList", {allWishes, dataUser});
  }

  exports.getHistorial = async (req, res)=>{
    const dataUser1 = await Users.find({email : userGlobal});
    const dataUser = dataUser1[0];
    const delivery = await Delivery.find({idClient: dataUser.email});
    res.render("userViews/historial", {delivery, dataUser});
  }