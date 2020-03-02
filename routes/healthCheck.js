/*
 Route containing endpoints related to the healthCheck
 */
const health = require('../controllers/healthCheck')
const messages = require('../services/messages')

// Route to check health of DB and EC2 instances
module.exports = function(app) {
	app.route('/healthcheck').get(async function(req, res) {
		try {
			const healthRes = await health.checkHealth(req)
			return res.json(messages.getMessageDetails(healthRes))
		} catch (e) {
			res.status(400)
			return res.json(messages.getMessageDetails(e))
		}
	})

	app.route('/apitest').get(function(req, res) {
		res.render('apiTest')
	})
}
