<template>
  <div class="view_single_todo">
  	<v-card>
			<v-form ref="form">
				<v-container>
					<v-layout row>
						<v-flex xs12>
							<h1>Todo: {{ this_todo.title }}</h1>
						</v-flex>
					</v-layout>
					<v-layout>
						<v-flex xs12>
							<v-text-field prepend-icon="title" 
								v-model="this_todo.title" label="Title" required>
							</v-text-field>
						</v-flex>
					</v-layout>

					<v-layout>
						<v-flex xs12>
							<v-text-field prepend-icon="description" 
								v-model="this_todo.description" label="Description">
							</v-text-field>
						</v-flex>
					</v-layout>

					<v-layout>
				    <v-flex xs12 sm6 md4>
				    	<!-- TODO: Datepickern borde kontrollera hur tunga olika dagar är och visualisera -->
				    	<!-- TODO: Faktum är att due-date kanske inte borde sättas här alls. I planeringsvyn
				    							borde olika uppgifter planeras in... Hum! -->
				      <v-menu
				        ref="menu"
				        v-model="menu"
				        :close-on-content-click="false"
				        :nudge-right="40"
				        :return-value.sync="date"
				        lazy
				        transition="scale-transition"
				        offset-y
				        full-width
				        min-width="290px"
				      >
				        <template v-slot:activator="{ on }">
				          <v-text-field
				            v-model="date"
				            label="Due Date"
				            prepend-icon="event"
				            readonly
				            v-on="on"
				          ></v-text-field>
				        </template>
				        <v-date-picker v-model="date" no-title scrollable>
				          <v-spacer></v-spacer>
				          <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
				          <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
				        </v-date-picker>
				      </v-menu>
				    </v-flex>
					</v-layout>
					<v-layout>
						<v-flex xs12>
							<v-icon>priority_high</v-icon>
							<span class="lighten-1 subheading">Priority</span>
					    <v-rating class="px-4"
					      v-model="this_todo.priority"
					      empty-icon="error_outline"
					      full-icon="error"
					      hover
					      color="red lighten-1"
					      background-color="grey lighten-1"
					    ></v-rating>						
						</v-flex>
					</v-layout>

					<v-layout>
			      <v-flex xs12 sm6>
			        <v-select
			          v-model="this_todo.categories"
			          :items="all_todo_categories"
			          item-text="name"
			          item-value="uuid"
			          :menu-props="{ maxHeight: '400' }"
			          label="Categories"
			          multiple
			          chips
			          prepend-icon="category"
			          hint="Choose categories"
			          persistent-hint
			        ></v-select>
			      </v-flex>
					</v-layout>

					<v-layout>
			      <v-flex xs12 sm6>
			        <v-select
			          v-model="this_todo.tags"
			          :items="all_todo_tags"
			          item-text="name"
			          item-value="uuid"
			          :menu-props="{ maxHeight: '400' }"
			          label="Tags"
			          multiple
			          chips 
			          prepend-icon="local_offer"
			          hint="Choose tags"
			          persistent-hint
			        ></v-select>
			      </v-flex>

					</v-layout>
					<v-layout row>
		      	<v-spacer></v-spacer>
		      	<v-flex xs6>
				  		<v-btn color="success" @click="$refs.inputUpload.click()">
				  			<v-icon>attach_file</v-icon>
				  			Attach File
				  		</v-btn>
							<input v-show="false" ref="inputUpload" type="file" @change="attachFile" >
		      	</v-flex>
		      	<v-flex xs6>
		      		<v-tooltip top>
		      			<template v-slot:activator="{ on }">
				      		<v-btn color="primary" v-on="on" @click="convertTodo">
				      			Convert to Task
				      		</v-btn>
				      	</template>
				      	<span>
				      		If you think this will be a recurring todo, you might as well convert it 
				      		into a task
				      	</span>
				      </v-tooltip>
				      <v-btn color="primary" 
				      	@click="saveTodo">
		      			Save
		      		</v-btn>
		      	</v-flex>
		      </v-layout>
				</v-container>
			</v-form>
	  </v-card>  
	</div>
</template>


<script>

import { mapGetters, mapActions } from 'vuex'

export default {
  name: "view-single-todo",
  props: ['uuid'],
  data: () => ({
  	this_todo: {},
  	last_date: '',
  	menu: false,
  	date: ''
	}),
	created: function() {
/*		
		this.$store.dispatch("setPrimaryButtonMenu", {
			name: "todo_single_view",
			data: [
        { icon: "dashboard", text: "Home", route: "/" },
			]
		})
*/		
	},
	mounted: function() {
		this.this_todo = this.todos[this.uuid]
		this.date = this.this_todo.due_date
	},
	computed: {
		...mapGetters([
			'todos',
			'todo_categories',
			'todo_tags'
		]),
		all_todo_categories: function() {
			return Object.values(this.todo_categories)
		},
		all_todo_tags: function() {
			return Object.values(this.todo_tags)
		},
		// mapGetters and mapActions here.
	},
	watch: {
		date: function(newDate, oldDate) {
			this.this_todo.due_date = newDate
			this.last_date = oldDate
		}
	},
	methods: {
		attachFile: function() {
			alert("dodad")
		},
		saveTodo: function() {
			//this.this_todo["due_date"] = this.date
			this.$store.dispatch("saveTodo", this.this_todo)
			this.$router.push('/todo')
		},
		convertTodo: function() {
			// Collect and Pass object to the "Create Task" view by router-pushing...
		}
	}
}
</script>
