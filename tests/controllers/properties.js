const should = require('should')
const sinon = require('sinon')
const utilities = require('../../services/utilities')
const properties = require('../../controllers/properties')
const propertiesModel = require('../../models/properties')
const dummyPropertiesResponse = require('./../propertiesResponse.json')
const dummyPropertyBookingResponse = require('./../propertyBookings.json')

let makeExternalCallStub
let getPropertyBookingDetailsStub

describe('#properties controller', function() {
	describe('#getNearByProperties', function() {
		before(function(done) {
			makeExternalCallStub = sinon
				.stub(utilities, 'makeExternalCall')
				.callsFake(function(url) {
					if (url.indexOf('37.7942,-122.4070') > -1) {
						return Promise.resolve(dummyPropertiesResponse)
					} else {
						return Promise.resolve({
							data: {
								results: {items: []},
								search: {context: [Object]}
							}
						})
					}
				})
			done()
		})
		after(function(done) {
			makeExternalCallStub.restore()
			done()
		})

		it('should return empty data as no hotels are near by', async function() {
			let queryParams = {
				at: '19.3625,71.5613'
			}

			const result = await properties.getNearByProperties(queryParams)
			result.data.should.be.an.Array()
			result.data.should.have.length(0)
			result.should.deepEqual({
				data: []
			})
		})

		it('should return near by hotels sorted in asc order with distance', async function() {
			let queryParams = {
				at: '37.7942,-122.4070'
			}

			const result = await properties.getNearByProperties(queryParams)
			queryParams.should.have.properties('at')
			result.data.should.be.an.Array()
			result.data.should.have.length(20)
			result.data[1].distance.should.be.greaterThanOrEqual(
				result.data[0].distance
			)
		})
	})

	describe('#propertyBookings', function() {
		before(function(done) {
			getPropertyBookingDetailsStub = sinon
				.stub(propertiesModel, 'getPropertyBookingDetails')
				.callsFake(function(params) {
					if (
						params.propertyId ==
						'8409q8yy-c0c0692b712548f48deb658b64f5f577'
					) {
						return Promise.resolve(dummyPropertyBookingResponse)
					} else {
						return Promise.resolve([])
					}
				})
			done()
		})
		after(function(done) {
			getPropertyBookingDetailsStub.restore()
			done()
		})

		it('should return empty data as no booking is done for the property', async function() {
			let params = {
				propertyId: '34422-c0c0692b712548f48deb658b64f5f577'
			}

			const result = await properties.getPropertyBookings(params)
			result.data.should.be.an.Array()
			result.data.should.have.length(0)
			result.should.deepEqual({
				data: []
			})
		})

		it('should return latest bookings data of the property in sorted order', async function() {
			let params = {
				propertyId: '8409q8yy-c0c0692b712548f48deb658b64f5f577'
			}

			const result = await properties.getPropertyBookings(params)
			params.should.have.properties('propertyId')
			result.data.should.be.an.Array()
			result.data.should.have.length(2)
			result.data[0].createdDate.should.be.greaterThanOrEqual(
				result.data[1].createdDate
			)
		})
	})
})
