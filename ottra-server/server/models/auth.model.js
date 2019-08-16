const tokenList = []

const AuthModel = {
	refreshTokenExist: function(refreshToken) {
		console.debug("%s: refreshTokenExist is called with %s", __filename, refreshToken)
		console.debug("%s: refreshTokenExist returns %O", __filename, tokenList[refreshToken])
		return tokenList[refreshToken]
	},
	updateTokenList: function(data) {
		console.debug("%s: updateTokenList is called with %O", __filename, data)
		tokenList[data.refreshToken] = data
	},
	getTokenList: function() { 
		console.debug("%s: getTokenList is called", __filename)
		console.debug("%s: getTokenList returns %O", __filename, tokenList)
		return tokenList
	}
}

process.on('eUserLogin', function(payload) { 
	console.debug("%s: eUserLogin caught: TokenList before update: %O", __filename, tokenList)
	AuthModel.updateTokenList(payload) 
	console.debug("%s: eUserLogin caught: TokenList after update: %O", __filename, tokenList)
})
process.on('eUserTokenRefreshed', function(userInfo) { 
})

module.exports = AuthModel