/*
Route containing endpoints related to the bookings
*/
const bookings = require('../controllers/bookings')
const messages = require('../services/messages')

// Route to make booking for a respective property for a duration of period
module.exports = function(app) {
	app.route('/api/bookings').post(async function(req, res) {
		try {
			const bodyParams = req.body
			const result = await bookings.bookProperty(bodyParams)
			if (result.error) res.status(422)
			return res.json(result)
		} catch (e) {
			res.status(400)
			return res.json(messages.prepareErrorMsg(e))
		}
	})
}
