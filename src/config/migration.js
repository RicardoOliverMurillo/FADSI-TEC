var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('Admin', '12345'));
var session = driver.session();

const Users = require('../models/users');
const Places = require('../models/Places');
const Delivery = require('../models/Delivery');

module.exports = async()=>{
    session
        .run('MATCH (n)DETACH DELETE n')
        .then(function(result){
            session.close();                
        })
        .catch(function(err){
            console.log(err);
        })

    const adminMongoClients = await Users.find({role : "client"});

    for(var i = 0; i < adminMongoClients.length; i++){
        const client = adminMongoClients[i];
        //console.log(client);
        const idUser = client.idUser.toString();
        const name = client.name;
        const last_name = client.last_name;
        const birth = client.birth;
        const email = client.email;
        const phone_number =  client.phone_number;
        const userName = client.userName;

        session
        .run('CREATE (n:Clients {idUser:{idUserParam},name:{nameParam},lastName:{lastNameParam},birth:{birthParam},email:{emailParam},phone_number:{phone_numberParam},userName:{userNameParam}}) Return n',
         {idUserParam:idUser,nameParam:name,lastNameParam:last_name,birthParam:birth,emailParam:email,phone_numberParam:phone_number,userNameParam:userName})
        .then(function(result){
            session.close();                
        })
        .catch(function(err){
            console.log(err);
        })
    };

    const adminMongoDeliveries = await Delivery.find();

    for(var i = 0; i < adminMongoDeliveries.length; i++){
        const delivery = adminMongoDeliveries[i];
        //console.log(delivery);

        const idDelivery = delivery._id.toString();
        //console.log(idDelivery);
        const product = delivery.product.length.toString();
        //console.log(product);
        const total = delivery.total.toString();
        //console.log(total);
        const date = delivery.date.toString();
        //console.log(date);
        const state = delivery.state;
        const idClient = delivery.idClient;
        const observation = delivery.observation;
        const idPlace = delivery.idPlace;

        session
        .run('CREATE (n:Deliveries {idDelivery:{idDeliveryParam},product:{productParam},total:{totalParam},date:{dateParam},state:{stateParam},idClient:{idClientParam},observation:{observationParam},idPlace:{idPlaceParam}}) Return n',
         {idDeliveryParam:idDelivery,productParam:product,totalParam:total,dateParam:date,stateParam:state,idClientParam:idClient,observationParam:observation,idPlaceParam:idPlace})
        .then(function(result){
            session.close();                
        })
        .catch(function(err){
            console.log(err);
        })
    };

    const adminMongoPlaces = await Places.find();

    for(var i = 0; i < adminMongoPlaces.length; i++){
        const place = adminMongoPlaces[i];
        //console.log(place);
        const idPlace = place.idPlace;
        const latitude = place.latitude;
        const longitude = place.longitude;
        const address = place.address;
        const category = place.category;
        const phone = place.phone;
        const rating = place.rating;
        const schedule = place.schedule;
        const website = place.website;
        const name = place.name;
        const description = place.description;
        const qDealer = place.qDealer;

        session
        .run('CREATE (n:Places {idPlace:{idPlaceParam},latitude:{latitudeParam},longitude:{longitudeParam},address:{addressParam},category:{categoryParam},phone:{phoneParam},rating:{ratingParam},schedule:{scheduleParam},website:{websiteParam},name:{nameParam},description:{descriptionParam},qDealer:{ratingParam}}) Return n',
         {idPlaceParam:idPlace,latitudeParam:latitude,longitudeParam:longitude,addressParam:address,categoryParam:category,phoneParam:phone,ratingParam:rating,scheduleParam:schedule,websiteParam:website,nameParam:name,descriptionParam:description,qDealerParam:qDealer})
        .then(function(result){
            session.close();                
        })
        .catch(function(err){
            console.log(err);
        })
    };


    for(var i = 0; i < adminMongoClients.length; i++){
        //console.log(adminMongoClients);
        const client = adminMongoClients[i];
        //console.log(client);
        const idUser = client.idUser.toString();
        console.log("Pto1: idUser");
        console.log(idUser);
        const email = client.email;
        //console.log("Pto1: email");
        //console.log(email);

        for(var j = 0; j < adminMongoDeliveries.length; j++){
            const delivery = adminMongoDeliveries[j];
            //console.log(delivery);
            const idDelivery = delivery._id.toString();
            //console.log("Pto2: idDelivery");
            //console.log(idDelivery);
            const idClientDelivery = delivery.idClient;
            //console.log("Pto2: idClientDelivery");
            //console.log(idClientDelivery);

            if(idClientDelivery==email){
                //console.log("Pto3: It is inside");
                //console.log("Pto3: "+idDelivery);
                //console.log("Pto3: "+idUser);
                session
                    .run('MATCH (a:Clients {idUser:{idUserParam}}),(b:Deliveries {idDelivery:{idDeliveryParam}}) MERGE(a)-[r:ORDER]-(b) RETURN a,b', {idDeliveryParam:idDelivery, idUserParam:idUser})
                    .then(function(result){
                        //console.log(idUser);
                        //console.log(idDelivery);
                        session.close();                
                    })
                    .catch(function(err){
                        console.log(err);
                    })
                //console.log("Pto3: R made");
            };
        };
    };

    for(var i = 0; i < adminMongoDeliveries.length; i++){
        const delivery = adminMongoDeliveries[i];
        //console.log(delivery);

        const idDelivery = delivery._id.toString();
        //console.log("Pto1: idDelivery");
        //console.log(idDelivery);
        const idPlaceDelivery = delivery.idPlace;
        //console.log("Pto1: idPlaceDelivery");
        //console.log(idPlaceDelivery);

        for(var j = 0; j < adminMongoPlaces.length; j++){
            const place = adminMongoPlaces[j];
            //console.log(place);
            const idPlace = place.idPlace;
            //console.log("Pto2: idPlaceDelivery");
            //console.log(idPlaceDelivery);
            //console.log("Pto2: idPlace");
            //console.log(idPlace);
            if (idPlaceDelivery == idPlace){
                //console.log("Pto3: It is inside");
                session
                    .run('MATCH (a:Deliveries {idDelivery:{idDeliveryParam}}),(b:Places{idPlace:{idPlaceParam}}) MERGE(a)-[r:LEAVES_FROM]-(b) RETURN a,b', {idPlaceParam:idPlace, idDeliveryParam:idDelivery})
                    .then(function(result){
                        session.close();                
                    })
                    .catch(function(err){
                        console.log(err);
                    })
                //console.log("Pto3: R made");
            };

        };

    };

}

//MATCH ()-[:ORDER]->(d) WHERE d.idClient = "anjelica.tristani98@gmail.com" RETURN d
//MATCH ()-[:LEAVES_FROM]->(p) RETURN p
//MATCH ()-[:LEAVES_FROM]->(p) RETURN p as Client, COUNT(p) as num ORDER BY num DESCENDING LIMIT 5

//MATCH (c:Clients)-[:ORDER]->(d:Deliveries{idClient:"rolivermurillo@gmail.com"})-[:LEAVES_FROM]->(p) RETURN p AS P
//MATCH (c:Clients)-[:ORDER]->(d:Deliveries{idPlace:"ChIJ4Q73ehLgoI8R5GLkU02fZlw"}) RETURN c
