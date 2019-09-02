module.exports = {
	sendResponse: function(res, { ok, data, error }) {
		if (ok)
			return res.json(data)
		else 
			return res.status(error.code).json(error)
	}
}