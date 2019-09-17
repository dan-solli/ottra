async function aSureThing(promise) {
	return await promise
	.then(function(data) {
		//console.debug("%s: aSureThing has data: %O", __filename, data)
		return { ok: true, data }
	})
	.catch(function(error) {
		console.error("%s: aSureThing failed: %O", __filename, error)
		Promise.resolve({ ok: false, error: {
				code: 500,
				status: 'server failure',
				message: error 
			}
		})
	})
}

module.exports = {
	aSureThing
}

