<template>
	<div class="single_message" id="msg.uuid">
		<v-card class="mx-auto my-5" max-width="600">
			<v-card-text> 
				<p class="display-1 text--primary"> {{ msg.subject }} </p>
				<p>
					(*) From: {{ msg.from }} <br />
					(*) Date: {{ msg.dateTime }} <br />
					(*) Type: {{ getMessageTypes[msg.type].typeText }} <br />
				</p>

				<v-divider></v-divider>

				<p> {{ msg.body }} </p>
			</v-card-text>
			<v-card-actions v-if="msg.type">
				<v-spacer></v-spacer>
				<v-btn :to="{ name: getMessageTypes[msg.type].route, params: { directive: getMessageTypes[msg.type].directive }}">
					{{ getMessageTypes[msg.type].text }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
	name: 'usertodo',
	props: [ 'uuid' ],
	data: () => ({
		msg: {
      subject: "",
      from: "",
      sent: "",
      status: "",
      body: "",
      uuid: "",
      timeToLive: -1,
      dateTime: '',
      type: ''
		}
	}),
	mounted: function() {
		Object.assign(this.msg, this.getMessageByID(this.uuid))
	},
	computed: {
		...mapGetters([
			"getMessageByID",
			"getMessageTypes"
		])
	}
}
</script>