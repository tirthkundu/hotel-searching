/*
This file consists of various utility functions
*/
const axios = require('axios')

module.exports = {
	// Sort data in ascending order w.r.t the parameter passed
	sortData: (data, paramToSort) => {
		data.sort((a, b) => {
			return a[paramToSort] - b[paramToSort]
		})
		return data
	},
	// Make an I/O call to third party using axios
	makeExternalCall: async (url, method, data, timeout) => {
		try {
			// GET method
			if (method == 'GET') {
				let data = await axios.get(url, {timeout: timeout})
				return data
			} else {
				// POST method
				let data = await axios.post(url, data, {timeout: timeout})
				return data
			}
		} catch (e) {
			// Throw unhandled errors or exceptions
			if (e.response && e.response.data && e.response.data.message) {
				throw e.response.data.message
			} else throw e
		}
	},
	// Generate unique booking id to be used for booking property
	generateBookingId: () => {
		return 'BK' + (Number(new Date()) + Math.ceil(Math.random() * 10000))
	},
	// Extract date part from date time
	getOnlyDate: datetime => {
		try {
			let date = new Date(datetime)
			return date.toISOString().slice(0, 10)
		} catch (e) {
			return datetime
		}
	},
	// Convert ISO date time to 'YYYY-MM-DD hh:mm:ss' format
	getDateTime: datetime => {
		try {
			let date = new Date(datetime)
			return date
				.toISOString()
				.replace('T', ' ')
				.replace('.000Z', '')
		} catch (e) {
			return datetime
		}
	}
}
