//General variables
const Users = require('../models/users');
const Place = require('../models/Places');
const Delivery = require('../models/Delivery');
const Product = require('../models/Products');


//Controller for grahp query 1: Search for a particular client and show all their order history.
exports.adminGraphQuery1 = (req, res) =>{
    res.render('AdminViews/graphQuery1View')
}

//Controller for grahp query 2: See all the places where clients have placed orders.
exports.adminGraphQuery2 = (req, res) =>{
    res.render('AdminViews/graphQuery2View')
}

//Controller for grahp query 3: See the 5 sites for which more orders have been registered.
exports.adminGraphQuery3 = (req, res) =>{
    res.render('AdminViews/graphQuery3View')
}

/*Controller for grahp query 4: Given a particular client, show all other clients who have made at least one
order on a place in common with that customer.*/
exports.adminGraphQuery4 = (req, res) =>{
    res.render('AdminViews/graphQuery4View')
}

/*Controller for grahp query 5: Given a client and an order placed, the system must take the places stored in 
the list of possible places to place orders, and must apply an algorithm to obtain the optimal route so that the 
client can order product in all the sites, this information is must send it by email to the user.*/
exports.adminGraphQuery5 = (req, res) =>{
    res.render('AdminViews/graphQuery5View')
}

