const bookings = require("../controllers/bookings");
const messages = require("../services/messages");


module.exports = function(app){
    app.route('/api/bookings').post(async function(req, res) {
        try{
            const bodyParams = req.body;
            const result = await bookings.bookProperty(bodyParams);
            return res.json(result);
        }catch(e){
            res.status(400)
            return res.json(messages.prepareErrorMsg(e));
        }
    })
};