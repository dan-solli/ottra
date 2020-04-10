<template>
	  <div>
    <v-toolbar flat color="white" class="elevation-1 mt-4">
      <v-toolbar-title>
        {{ $t('ui.view.taskview.heading') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn color="primary" class="mb-2" :to="{ name: 'new_task'}">
        {{ $t('ui.view.taskview.newtask') }}
      </v-btn>
     
    </v-toolbar>

    <v-container>
    	<v-toolbar flat class="elevation-2 mt-2">
    		<v-toolbar-title> Filter </v-toolbar-title>
    		<v-toolbar-items>
    			<v-select v-model="treeviewFilter"></v-select>
    		</v-toolbar-items>
    	</v-toolbar>

    	<v-row>
    		<v-col cols="4">
    			<v-treeview v-model="tree"
    				hoverable
    				dense
                    activatable
    				:items="items"
                    @update:active="showTask"
    				:loadChildren="loadChildren">
    			</v-treeview>
    		</v-col>

    		<v-col cols="8">
                <div v-if="selectedTask">
                    {{ selectedTask.subject }} |
                    {{ selectedTask.body }}
                    <router-link :to="{ name: 'add_steps_to_task', params: { task_uuid: selectedTask.uuid }}">
                        <v-icon>mdi-eye-outline</v-icon>
                    </router-link>
                    <v-btn icon @click="deleteTask">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </div>
    		</v-col>
    	</v-row>
    </v-container>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
	name: 'task-view',
	data: function() {
		return {
			treeviewFilter: '',
			tree: [],
            selectedTask: 0,
		}
	},
	computed: {
		...mapGetters([
			"getTasks",
			"getStepById",
            "getTaskById"
		]),
        items: function() {
            return Object.values(this.getTasks).map(function(task) {
                return {
                    id: task.uuid,
                    name: task.subject,
                }
            })
        },
	},
	methods: {
		loadChildren: function(item) {

		},
        showTask: function(item) {
            console.debug("%s: showTask got %O", __filename, item)
            this.selectedTask = Object.assign({}, this.getTaskById(item.pop()))
        },
        deleteTask: function(item) {
            if (this.selectedTask) {
                this.$store.dispatch("deleteTask", this.selectedTask.uuid)
            }
        }
	},
    async mounted() {
        await this.$store.dispatch("loadTasks")
    }
}
</script>