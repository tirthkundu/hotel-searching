/*
 This file includes test case for bookings controller
 We'll stub all I/O calls to remove side-effects
*/
const should = require('should')
const sinon = require('sinon')
const utilities = require('../../services/utilities')
const bookings = require('../../controllers/bookings')
const bookingsModel = require('../../models/bookings')

let makeExternalCallStub
let checkIfPropertyAvailableStub
let bookThePropertyStub

describe('#bookings controller', function() {
	// Make booking test cases
	describe('#getNearByProperties', function() {
		// Stub makeExternalCall function
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
		// Stub checkIfPropertyAvailable DB call
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
		// Stub bookTheProperty DB call
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
		// Test cases
		it('should throw error if checkIn and checkOut dates are not valid', async function() {
			let bodyParams = {
				propertyId: '8409q8yy-c0c0692b712548f48deb658b64f5f577',
				numOfGuests: 7,
				checkInDate: '2020-03-18',
				checkOutDate: '2020-03-09',
				firstName: 'Test',
				lastName: 'Xyz',
				email: 'axc@sjjs.shs',
				contactNumber: '17181881818',
				countryCode: '+91'
			}

			try {
				await bookings.bookProperty(bodyParams)
			} catch (e) {
				e.should.containEql('"checkOutDate" must be greater than')
			}
		})

		it('should return property does not exists', async function() {
			let bodyParams = {
				propertyId: '9409q8yy-c0c0692b712548f48deb658b64f5f57',
				numOfGuests: 7,
				checkInDate: '2020-03-08',
				checkOutDate: '2020-03-09',
				firstName: 'Test',
				lastName: 'Xyz',
				email: 'axc@sjjs.shs',
				contactNumber: '17181881818',
				countryCode: '+91'
			}

			try {
				await bookings.bookProperty(bodyParams)
			} catch (e) {
				e.should.eql(
					"Place with id '9409q8yy-c0c0692b712548f48deb658b64f5f57' not found."
				)
			}
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
			result.error.msgCode.should.eql('MG003')
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
			bodyParams.should.have.properties([
				'propertyId',
				'numOfGuests',
				'checkInDate',
				'checkOutDate',
				'firstName',
				'lastName',
				'email',
				'contactNumber',
				'countryCode'
			])
			result.data.bookingId.should.eql('BK26732838822')
		})
	})
})
