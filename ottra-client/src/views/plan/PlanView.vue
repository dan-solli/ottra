<template>
	<v-container fluid>
		<v-row>
			<v-col cols="6">
				<v-sheet height="650">
					<v-calendar
						ref="calendar"
						:events="events"
						color="primary"
						locale="sv"
						type="week">
					</v-calendar>
				</v-sheet>
			</v-col>

			<v-col cols="6">
				<v-expansion-panels popout>
					<v-expansion-panel>
						<v-expansion-panel-header>(*) Belated tasks</v-expansion-panel-header>
						<v-expansion-panel-content>Lorem Ipsum</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel>
						<v-expansion-panel-header>(*) Unplanned todos</v-expansion-panel-header>
						<v-expansion-panel-content>
							<div v-for="todo in todoList" :key="todo.uuid">
								{{ todo.subject }}
							</div>
						</v-expansion-panel-content>
					</v-expansion-panel>
					<v-expansion-panel>
						<v-expansion-panel-header>(*) All tasks</v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-container fluid>
								<v-row>
									<v-col cols="3">
										<div v-for="task in taskList" :key="task.uuid">
											{{ task.subject }}
										</div>
									</v-col>
									<v-col cols="9">
										Room for a card here
									</v-col>
								</v-row>
							</v-container>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
	name: 'plan-view',
	data: function() {
		return {
			events: [],
		}
	},
	computed: {
		...mapGetters([
			"getTasks",
			"getTodos",
		]),
		todoList: function() {
			return Object.values(this.getTodos)
		},
		taskList: function() {
			return Object.values(this.getTasks)
		},
	},
	created() {
		this.$store.dispatch("loadTasks")
		this.$store.dispatch("loadTodos")
	},
	mounted() {
		this.$refs.calendar.scrollToTime('08:30')
	}
}
</script>

