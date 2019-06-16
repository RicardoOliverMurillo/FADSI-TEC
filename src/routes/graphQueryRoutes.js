const GraphQuery = require('../controllers/graphQueryController');

module.exports = (router) => {
    router.get('/graphQuery1', GraphQuery.adminGraphQuery1);
    router.get('/graphQuery2', GraphQuery.adminGraphQuery2);
    router.get('/graphQuery3', GraphQuery.adminGraphQuery3);
    router.get('/graphQuery4', GraphQuery.adminGraphQuery4);
    router.get('/graphQuery5', GraphQuery.adminGraphQuery5);
    router.post('/graphQuery1Post', GraphQuery.adminGraphQuery1Post);
    router.post('/graphQuery1PostR', GraphQuery.adminGraphQuery1PostR)
}