/*
This file consists of error messages body and also functions to construct error messages
*/

// Messages for respective error codes
const MessageCodes = {
	MG000: {
		msgCode: 'MG000',
		msgText: 'Connection failed.',
		msgType: 'Error'
	},
	MG001: {
		msgCode: 'MG001',
		msgText: 'Received response from APIs.',
		msgType: 'Info'
	},
	MG002: {
		msgCode: 'MG002',
		msgText: 'Something went wrong.',
		msgType: 'Error'
	},
	MG003: {
		msgCode: 'MG003',
		msgText: 'Booking not possible for desired dates',
		msgType: 'Error'
	}
}

/*
 Get error message
 Input: Message code
 Output: Error body w.r.t error code
 */
const getMsg = msgCode => {
	try {
		let msgObj = MessageCodes[msgCode]
		msgObj = JSON.parse(JSON.stringify(msgObj))
		if (msgObj.msgType == 'Error') {
			return {
				error: msgObj
			}
		} else {
			return {
				data: msgObj
			}
		}
	} catch (e) {
		return {
			error: MessageCodes['MG002']
		}
	}
}

/*
 Construct error message
 Input: Error message
 Output: Error body
 */
const prepareErrorMsg = errMsg => {
	if (!errMsg) {
		return {
			error: MessageCodes['MG002']
		}
	}
	return {error: {msgText: errMsg, msgType: 'Error'}}
}

module.exports = {
	getMessageDetails: getMsg,
	prepareErrorMsg: prepareErrorMsg
}
