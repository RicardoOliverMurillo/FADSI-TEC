//variables generales
const Users = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey123456';
//variables globales
var userGlobal = "";
var nameGlobal ="";

//Controlador para abrir la vista de administrador
exports.adminPage = (req, res) =>{
    res.render('AdminViews/mainView')
}
//Controlador para abrir la vista de usuario
exports.userPage = (req, res) =>{
    res.render('userViews/userView')
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
                    res.render('UserViews/userView')  
                } else {
                    userGlobal = dataUser.email;
                    nameGlobal = "admin";
                    res.render('AdminViews/adminView')
                }
                
            }else{
                //password wrong

                res.status(409).send({message: 'something is wrong'});
            }
            
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

