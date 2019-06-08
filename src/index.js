const path = require('path');
const express = require('express');
const cors = require('cors');
const properties = require('./config/props');
const DB = require('./config/db');
const bodyParser = require('body-parser');

//Importing routes
const userRoutes = require('./routes/userRoutes');
const placesRoutes = require('./routes/placesRoutes');
const productsRoutes = require('./routes/productsRoutes');


//init DB
DB();

//bodyparser
const bodyParserJSON = bodyParser.json();
const bodyParserURLEncoded = bodyParser.urlencoded({extended: true});

const app = express();
const router = express.Router();

//Routes
userRoutes(router)
router.get('/', userRoutes);
placesRoutes(router)
router.get('/places', placesRoutes);
productsRoutes(router)
router.get('/products', productsRoutes);

//views engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded); 
app.use('/api', router)


app.use(router);


app.listen(properties.PORT, ()=> console.log(`Server on port ${properties.PORT}`));