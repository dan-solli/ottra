function to(promise) {
	return promise.then(data => {
		return [data, null]
	})
	.catch(err => [null, err])
}

function aSureThing(promise) {
	return promise
	.then(function(data) {
		return { ok: true, data }
	})
	.catch(function(error) {
		return { ok: false, error }
	})
}

module.exports = {
	to,
	aSureThing
}