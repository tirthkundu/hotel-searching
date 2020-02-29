const properties = require("../controllers/properties");
const messages = require("../services/messages");


module.exports = function(app){
    app.route('/api/properties').get(async function(req, res) {
        try{
            var queryParams = req.query;
            const nearByProperties = await properties.getNearByProperties(queryParams);
            return res.json(nearByProperties);
        }catch(e){
            res.status(400)
            return res.json(messages.prepareErrorMsg(e));
        }
    })
};