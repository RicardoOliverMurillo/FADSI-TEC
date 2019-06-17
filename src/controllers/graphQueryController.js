//Connet to Neo4j
var logger = require('morgan');
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('Admin', '12345'));
var session = driver.session();
const Migration = require('../config/migration');

//General variables
const Users = require('../models/users');
const Place = require('../models/Places');
const Delivery = require('../models/Delivery');
const Product = require('../models/Products');

//Controller for grahp query 1: Search for a particular client and show all their order history.
exports.adminGraphQuery1 = (req, res) =>{
    var deliveriesArr = [];
    res.render('AdminViews/graphQuery1View', {deliveries: deliveriesArr})
}

exports.adminGraphQuery1Post = (req, res) =>{
    Migration();
    var email = req.body.email;
    session
        .run('MATCH ()-[:ORDER]->(d) WHERE d.idClient = {emailParam} RETURN d', {emailParam:email})
        .then(function(result){
            var deliveriesArr = [];
            result.records.forEach(function(record){
                deliveriesArr.push({
                    idDelivery: record._fields[0].properties.idDelivery,
                    idClient: record._fields[0].properties.idClient,
                    idPlace: record._fields[0].properties.idPlace,
                    date: record._fields[0].properties.date,
                    observation: record._fields[0].properties.observation,
                    product: record._fields[0].properties.product,
                    state: record._fields[0].properties.state,
                    total: record._fields[0].properties.total
                });
            })
            res.render('AdminViews/graphQuery1View', { deliveries: deliveriesArr})            
        })
        .catch(function(err){
            console.log(err);
        })
}

//Controller for grahp query 2: See all the places where clients have placed orders.
exports.adminGraphQuery2 = (req, res) =>{
    Migration();
    session
    .run('MATCH ()-[:LEAVES_FROM]->(p) RETURN p')
    .then(function(result){
        var placesArr = [];
        result.records.forEach(function(record){
            placesArr.push({
                //id: record._fields[0].identity.low,
                address: record._fields[0].properties.address,
                category: record._fields[0].properties.category,
                description: record._fields[0].properties.description,
                idPlace: record._fields[0].properties.idPlace,
                latitude: record._fields[0].properties.latitude,
                longitude: record._fields[0].properties.longitude,
                name: record._fields[0].properties.name,
                phone: record._fields[0].properties.phone,
                qDealer: record._fields[0].properties.qDealer,
                rating: record._fields[0].properties.rating,
                schedule: record._fields[0].properties.schedule,
                website: record._fields[0].properties.website
            });
        })
        var hash = {};
        placesArr = placesArr.filter(function(current) {
            var exists = !hash[current.idPlace] || false;
            hash[current.idPlace] = true;
            return exists;
        });
        //console.log("placesArr");
        //console.log(placesArr);
        res.render('AdminViews/graphQuery2View', { places: placesArr})
    })
    .catch(function(err){
        console.log(err);
    })

    //res.render('AdminViews/graphQuery2View')
}

//Controller for grahp query 3: See the 5 sites for which more orders have been registered.
exports.adminGraphQuery3 = (req, res) =>{
    Migration();

    session
    .run('MATCH ()-[:LEAVES_FROM]->(p) RETURN p as Client, COUNT(p) as num ORDER BY num DESCENDING LIMIT 5')
    .then(function(result){
        var placesArr = [];
        result.records.forEach(function(record){
            placesArr.push({
                //id: record._fields[0].identity.low,
                address: record._fields[0].properties.address,
                category: record._fields[0].properties.category,
                description: record._fields[0].properties.description,
                idPlace: record._fields[0].properties.idPlace,
                latitude: record._fields[0].properties.latitude,
                longitude: record._fields[0].properties.longitude,
                name: record._fields[0].properties.name,
                phone: record._fields[0].properties.phone,
                qDealer: record._fields[0].properties.qDealer,
                rating: record._fields[0].properties.rating,
                schedule: record._fields[0].properties.schedule,
                website: record._fields[0].properties.website
            });
        })
        res.render('AdminViews/graphQuery3View', { places: placesArr})
    })
    .catch(function(err){
        console.log(err);
    })

    //res.render('AdminViews/graphQuery3View')
}

/*Controller for grahp query 4: Given a particular client, show all other clients who have made at least one
order on a place in common with that customer.*/
exports.adminGraphQuery4 = (req, res) =>{
    Migration();
    var clientsArr = [];
    res.render('AdminViews/graphQuery4View', {clients: clientsArr})
}

exports.adminGraphQuery4Post = (req, res) =>{
    var email = req.body.email;
    //var placesArr = [];
    var clientsArr = [];
    session
    .run('MATCH (c:Clients)-[:ORDER]->(d:Deliveries{idClient:{emailParam}})-[:LEAVES_FROM]->(p) RETURN p', {emailParam:email})
    .then(function(result){
        var placesArr = [];
        result.records.forEach(function(record){
            placesArr.push({
                idPlace: record._fields[0].properties.idPlace
            });
        });
        //console.log("placesArr");
        //console.log(placesArr);
        var hash = {};
        placesArr = placesArr.filter(function(current) {
            var exists = !hash[current.idPlace] || false;
            hash[current.idPlace] = true;
            return exists;
        });
        //console.log("placesArr");
        //console.log(placesArr);
        var num = placesArr.length;
        var xArr = [];
        for(i=0; i<num; i++) {
            idPlace = placesArr[i].idPlace
            //console.log("idPlace");
            //console.log(idPlace);
            session
                //.run('MATCH (c:Clients)-[:ORDER]->(d:Deliveries{idPlace:{idPlaceParam}}) WHERE NOT c.email={emailParam} RETURN c', {idPlaceParam:idPlace,emailParam:email})
                .run('MATCH (c:Clients)-[:ORDER]->(d:Deliveries{idPlace:{idPlaceParam}}) RETURN c', {idPlaceParam:idPlace})
                .then(function(result){
                    result.records.forEach(function(record){
                        clientsArr.push({
                            idUser: record._fields[0].properties.idUser,
                            name: record._fields[0].properties.name,
                            lastName: record._fields[0].properties.lastName,
                            userName: record._fields[0].properties.userName,
                            birth: record._fields[0].properties.birth,
                            email: record._fields[0].properties.email,
                            phone_number: record._fields[0].properties.phone_number
                        });
                        //console.log("clientsArr");
                        //console.log(clientsArr);

                        for(j=0;j<clientsArr.length;j++){
                            //console.log("clientsArr"+j);
                            //console.log(clientsArr[j]);
                            xArr.push(clientsArr[j]);
                            //console.log("xArr"+i);
                            //console.log(xArr);
                        }

                    })
                    var hash1 = {};
                    xArr = xArr.filter(function(current) {
                        var exists = !hash1[current.idUser] || false;
                        hash1[current.idUser] = true;
                        return exists;
                    });
                    console.log("ArrFINAL");
                    console.log(xArr);
                    res.render('AdminViews/graphQuery4View', {clients: xArr});
                    //res.redirect('/graphQuery4', {clients: xArr});
                    //res.send({clients: xArr});
                })
                .catch(function(err){
                    console.log(err);
                })
            }  
    })
    .catch(function(err){
        console.log(err);
    })
}



/*Controller for grahp query 5: Given a client and an order placed, the system must take the places stored in 
the list of possible places to place orders, and must apply an algorithm to obtain the optimal route so that the 
client can order product in all the sites, this information is must send it by email to the user.*/
exports.adminGraphQuery5 = (req, res) =>{
    res.render('AdminViews/graphQuery5View')
}

