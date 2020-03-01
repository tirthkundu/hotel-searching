const should = require('should')
const sinon = require('sinon')
const utilities = require('../../services/utilities')
const properties = require('../../controllers/properties')
const dummyPropertiesResponse = require('./../propertiesResponse.json')

let makeExternalCallStub;


describe('#properties controller', function() {
    describe('#getNearByProperties', function() {
    before(function (done) {
        makeExternalCallStub = sinon
            .stub(utilities, 'makeExternalCall')
            .callsFake(function (url) {
                if (url.indexOf('37.7942,-122.4070') > -1) {
                    return Promise.resolve(dummyPropertiesResponse)
                } else {
                    return Promise.resolve({data:{ results: { items: [] }, search: { context: [Object] }}})
                }
            })
        done()
    })
    after( function(done) {
        makeExternalCallStub.restore()
        done()
    })


        it('should return empty data as no hotels are near by', async function () {
            let queryParams = {
                at: '19.3625,71.5613'
            }

            const result = await properties.getNearByProperties(queryParams)
            result.should.deepEqual({
                "data": []
            })
        })

        it('should return near by hotels sorted in asc order with distance', async function () {
            let queryParams = {
                at: '37.7942,-122.4070'
            }

            const result = await properties.getNearByProperties(queryParams)
            result.data.should.have.length(20)
            result.data[1].distance.should.be.greaterThanOrEqual(result.data[0].distance)
        })
    })
})