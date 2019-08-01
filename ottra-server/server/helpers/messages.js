module.exports = function(driver) {
	return {
		createNewMessage: function(sender = null, 
															recipient = null, 
															subject = 'No subject',
															body = 'No text',
															timeToLive = -1,
															type = 'system#message')
		{
			if (!sender || !recipient)
				return Promise.reject("Message need a sender and a recipient")
			else {
				let session = driver.session()
				return session
				.run(`
	MATCH (u:User { uuid : {recipient} })					
	CREATE (u)-[:HAS]->(n:Message { 
						from: {sender},
						recipient: {recipient},
						subject: {subject},
						body: {body},
						timeToLive: {timeToLive},
						type: {type},
						status: 'unread',
						sent: TIMESTAMP()
					}) return id(n)`, 
					{
						sender, recipient, subject, body, timeToLive, type
					}
				)
				.then((response) => {
					console.log("Created message with type " + type)
					Promise.resolve(response)
				})
				.catch((err) => {
					console.log("Failed to create message with type " + type)
					Promise.reject(err)
				})
			}
		}
	}
}
