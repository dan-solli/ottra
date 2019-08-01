const Helpers = {
	createError(msg) {
		return {
			errors: {
				body: [ msg ]
			}
		}
	}
};

module.exports = Helpers;