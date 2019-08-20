const SendResponse = {
	response: function(res, result) {
		console.debug("%s: response(response-object, %O)", __filename, result)
		const [ reply, error ] = result

		if (reply !== null) {
			res.send(reply)
		} else {
			res.status(error.code).send(error)
		}
	}
}

module.exports = SendResponse