const should = require('should')
const sinon = require('sinon')
const utilities = require('../../services/utilities')
const bookings = require('../../controllers/bookings')
const bookingsModel = require('../../models/bookings')

let makeExternalCallStub
let checkIfPropertyAvailableStub
let bookThePropertyStub

describe('#bookings controller', function() {
	describe('#getNearByProperties', function() {
		before(function(done) {
			makeExternalCallStub = sinon
				.stub(utilities, 'makeExternalCall')
				.callsFake(function(url) {
					if (
						url.indexOf(
							'8409q8yy-c0c0692b712548f48deb658b64f5f577'
						) > -1
					) {
						return Promise.resolve({
							name: 'Fairmont San Francisco',
							placeId: '8409q8yy-c0c0692b712548f48deb658b64f5f577'
						})
					} else {
						return Promise.reject(
							"Place with id '9409q8yy-c0c0692b712548f48deb658b64f5f57' not found."
						)
					}
				})
			done()
		})
		after(function(done) {
			makeExternalCallStub.restore()
			done()
		})

		before(function(done) {
			checkIfPropertyAvailableStub = sinon
				.stub(bookingsModel, 'checkIfPropertyAvailable')
				.callsFake(function(params) {
					if (params.checkInDate == '2020-03-08') {
						return Promise.resolve([
							{
								isPropertyBooked: 0
							}
						])
					} else {
						return Promise.resolve([
							{
								isPropertyBooked: 1
							}
						])
					}
				})
			done()
		})
		after(function(done) {
			checkIfPropertyAvailableStub.restore()
			done()
		})

		before(function(done) {
			bookThePropertyStub = sinon
				.stub(bookingsModel, 'bookTheProperty')
				.callsFake(function(params) {
					if (params.checkInDate == '2020-03-08') {
						return Promise.resolve({bookingId: 'BK26732838822'})
					} else {
						return Promise.reject('error')
					}
				})
			done()
		})
		after(function(done) {
			bookThePropertyStub.restore()
			done()
		})

		it('should return error saying property already booked on desired dates', async function() {
			let bodyParams = {
				propertyId: '8409q8yy-c0c0692b712548f48deb658b64f5f577',
				numOfGuests: 7,
				checkInDate: '2020-03-07',
				checkOutDate: '2020-03-09',
				firstName: 'Test',
				lastName: 'Xyz',
				email: 'axc@sjjs.shs',
				contactNumber: '17181881818',
				countryCode: '+91'
			}

			const result = await bookings.bookProperty(bodyParams)
			result.error.MsgCode.should.eql('MG003')
		})

		it('should book the property for desired dates', async function() {
			let bodyParams = {
				propertyId: '8409q8yy-c0c0692b712548f48deb658b64f5f577',
				numOfGuests: 7,
				checkInDate: '2020-03-08',
				checkOutDate: '2020-03-09',
				firstName: 'Test',
				lastName: 'Xyz',
				email: 'axc@sjjs.shs',
				contactNumber: '17181881818',
				countryCode: '+91'
			}

			const result = await bookings.bookProperty(bodyParams)
			result.data.BookingId.should.eql('BK26732838822')
		})
	})
})
