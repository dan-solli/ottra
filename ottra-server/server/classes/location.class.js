class Location {
	constructor(payload) {
		// I want to create the location both from a http-post as well as a cypher result. How 
		// do I go about that? 
		if (payload.hasOwnProperty('body')) { // This is a HTTP-POST and payload is a "req"
			this._name = payload.body.name
			this._uuid = payload.body.uuid || null // Most likely a new object then

			if (payload.hasOwnProperty('files')) { // There are files attached
				this._files = payload.files.map(x => new Document(x))
			}
			this._creator = payload.tokenData.uuid
		} 
		else if (payload.hasOwnProperty('uuid') { // This is most likely a Cypher response.

		} else { // I can't think of anything else to create a Location object.
			// Foo
		})

	}
}