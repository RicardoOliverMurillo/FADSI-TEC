//Connet to Neo4j
var logger = require('morgan');
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('adminNeo4j', '12345'));
var session = driver.session();
const Migration = require('../config/migration');

//General variables
const Users = require('../models/users');
const Place = require('../models/Places');
const Delivery = require('../models/Delivery');
const Product = require('../models/Products');

//Controller for Clients Migration View
exports.adminClientsMigration = (req, res) =>{
    Migration();
    res.render('AdminViews/migrationClientsView')
}

//Controller for Places Migration View
exports.adminPlacesMigration = (req, res) =>{
    res.render('AdminViews/migrationPlacesView')
}

//Controller for Deliveries Migration View
exports.adminDeliveriesMigration = (req, res) =>{
    res.render('AdminViews/migrationDeliveriesView')
}


//Controller for grahp query 1: Search for a particular client and show all their order history.
exports.adminGraphQuery1 = (req, res) =>{
    session
        .run('MATCH (n:Person) RETURN n LIMIT 25')
        .then(function(result){
            var personArr = [];
            result.records.forEach(function(record){
                personArr.push({
                    id: record._fields[0].identity.low,
                    name: record._fields[0].properties.name
                });
            })
            res.render('AdminViews/graphQuery1View', { persons: personArr})
        })
        .catch(function(err){
            console.log(err);
        })
}

exports.adminGraphQuery1Post = (req, res) =>{
    var name = req.body.person_name;
    var lastName = req.body.person_lastName;

    //console.log(name);

    session
        .run('CREATE (n:Person {name:{nameParam},lastName:{lastNameParam}}) Return n.name', {nameParam:name, lastNameParam:lastName})
        .then(function(result){
            res.redirect('/graphQuery1');
            session.close();                
        })
        .catch(function(err){
            console.log(err);
        })
}

exports.adminGraphQuery1PostR = (req, res) =>{
    var name = req.body.name;
    var title = req.body.title;

    //console.log(name);

    session
        .run('MATCH (a:Person {name:{nameParam}}),(b:Movie{title:{titleParam}}) MERGE(a)-[r:LIKE]-(b) RETURN a,b', {titleParam:title, nameParam:name})
        .then(function(result){
            res.redirect('/graphQuery1');
            session.close();                
        })
        .catch(function(err){
            console.log(err);
        })
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

