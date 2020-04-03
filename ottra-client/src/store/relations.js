import Vue from 'vue'

import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const RelRepo = RepositoryFactory.get('relation')

const Relations = {
	actions: {
		createRelation: async function ({ dispatch, commit }, payload) {
			/* Payload is in the form of:

			[ 
				{ 
					source: uuid ,
					destination: [ uuid, ... ],
					label_type: type,
					label_properties: { props }
				}, ...
			]

			*/

			var results = []
			payload.forEach(async function (entry) {
				const result = await RelRepo.createRelation(entry)
				results.push(result)
			})
			return results
		}
	},
}