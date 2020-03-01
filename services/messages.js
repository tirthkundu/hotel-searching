const MessageCodes = {
	MG000: {
		MsgCode: 'MG000',
		MsgText: 'Connection failed.',
		MsgType: 'Error'
	},
	MG001: {
		MsgCode: 'MG001',
		MsgText: 'Received response from APIs.',
		MsgType: 'Info'
	},
	MG002: {
		MsgCode: 'MG002',
		MsgText: 'Something went wrong.',
		MsgType: 'Error'
	},
	MG003: {
		MsgCode: 'MG003',
		MsgText: 'Booking not possible for desired dates',
		MsgType: 'Error'
	}
}

const getMsg = msgCode => {
	try {
		let msgObj = MessageCodes[msgCode]
		msgObj = JSON.parse(JSON.stringify(msgObj))
		if (msgObj.MsgType == 'Error') {
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

const prepareErrorMsg = errMsg => {
	if (!errMsg) {
		return {
			error: MessageCodes['MG002']
		}
	}
	return {error: {MsgText: errMsg, MsgType: 'Error'}}
}

module.exports = {
	getMessageDetails: getMsg,
	prepareErrorMsg: prepareErrorMsg
}
