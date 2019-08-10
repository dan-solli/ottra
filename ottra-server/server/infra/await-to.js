function to(promise) {
	return promise.then(data => {
		return [data, null]
	})
	.catch(err => [null, err])
}

module.exports = to