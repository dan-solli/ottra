
const { aSureThing } = require('./../infra/await-to')
const DocumentModel = require('./../models/document.model')

process.on("attachDocument", async function attach(to_uuid, file) {

	// This event should call a non-exported function in this service module and let it handle the 
	// actual file-processing and condence the file-maps parameters to what is necessary. 

	// The actu

	return await aSureThing(DocumentModel.attach(to_uuid, file))
}

function processFile(user_id, file)
{
	
}