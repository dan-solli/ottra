async function aSureThing(promise) {
	return await promise
	.then(function(data) {
		//console.debug("%s: aSureThing has data: %O", __filename, data)
		return { ok: true, data }
	})
	.catch(function(error) {
		Promise.resolve({ ok: false, error })
	})
}

module.exports = {
	aSureThing
}

