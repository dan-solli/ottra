const CommonModel = require('./../models/common.model')

const CommonService = {
	createRelation: async function(src, dest, label, props) {
		console.debug("%s: createRelation: Src: %s, Dest: %s, Label: %s, Props: %O", 
			__filename, src, dest, label, props)
		return await CommonModel.createRelation(src, dest, label, props)
	},
}

module.exports = CommonService