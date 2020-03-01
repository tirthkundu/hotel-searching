const axios = require('axios')

module.exports = {
    sortData : (data, paramToSort) => {
        data.sort((a,b) => {return (a[paramToSort] - b[paramToSort])})
        return data;
    },
    makeExternalCall : async (url, method, data, timeout) => {
        try {
            if (method == 'GET') {
                let data = await axios.get(url, {"timeout": timeout})
                return data
            }
            else {
                let data = await axios.post(url, data, {"timeout": timeout})
                return data
            }

        }
        catch (e) {
            if (e.response && e.response.data && e.response.data.message) {
                throw e.response.data.message
            }
            else throw e;
        }
    },
    generateBookingId: () => {
        return 'BK'+(Number(new Date())+Math.ceil(Math.random()*10000))
    },
    getOnlyDate: (datetime) => {
        let date = new Date(datetime);
        try {
            return (date.toISOString().slice(0, 10));
        }catch (e){
            return (datetime)
        }
    },
    getDateTime: (datetime) => {
        let date = new Date(datetime);
        return (date.toISOString().replace('T',' ').replace('.000Z',''));
    }
}