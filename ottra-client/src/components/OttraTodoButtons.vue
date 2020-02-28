<template>
  <v-speed-dial v-model="localFab" direction="right">
    <template v-slot:activator>
      <v-list-item-icon class="mx-0">
        <v-btn class="orange lighten-3" small icon text>
          <v-icon v-if="localFab">mdi-close</v-icon>
          <v-icon v-else>mdi-plus</v-icon>
        </v-btn>
      </v-list-item-icon>
    </template>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" fab small dark color="green"
            @click="doneTodo(todo.uuid)">
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </template>
      {{ $t('ui.text.checkdone') }}
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" fab small class="blue lighten-4"
            @click="editTodo(todo.uuid)">
          <v-icon>mdi-file-document-edit-outline</v-icon>
        </v-btn>
      </template>
      {{ $t('ui.text.edit') }}
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" fab small class="light-green lighten-4">
          <v-icon>mdi-calendar-plus</v-icon>
        </v-btn>
      </template>
      {{ $t('ui.text.plan') }}
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" fab small disabled>
          <v-icon>mdi-forward</v-icon>
        </v-btn>
      </template>
      {{ $t('ui.text.forward') }}
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" fab small>
          <v-icon>mdi-clipboard-arrow-right-outline</v-icon>
        </v-btn>
      </template>
      {{ $t('ui.text.promote') }}
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" fab small class="red lighten-3" 
            @click="deleteTodo(todo.uuid)">
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </template>
      {{ $t('ui.text.delete') }}
    </v-tooltip>
  </v-speed-dial>

</template>

<script>

import { mapGetters } from "vuex";

export default {
	name: 'ottra-todo-buttons',
	props: [ 'todo' ],
	data: function() {
		return {
			localFab: ''
		}
	},
	computed: {
		...mapGetters([
			"getTodoById",
		])
	},
	methods: {
    deleteTodo: function(todo_uuid) {
      this.$store.dispatch("deleteTodo", todo_uuid)
    },
    doneTodo: function(todo_uuid) {
      const todo = Object.assign({}, this.getTodoById(todo_uuid))
      todo.status = TODO_DONE
      this.$store.dispatch("updateTodo", todo)
    },
    editTodo: function(todo_uuid) {
      this.$router.push("/todo/" + todo_uuid)      
    }  
	}
}

</script>