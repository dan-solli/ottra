<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>(*) Inbox </v-toolbar-title>
  
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on"> (*) New Message</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.from" label="(*) From"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.subject" label="(*) Subject"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.dateTime" label="(*) Date"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.type" label="(*) Type"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="messages"
      item-key="uuid"
      class="elevation-1"
    >
      <template v-slot:item="props">
        <tr @click="gotoMessage(props.item.uuid)">
          <td>{{ props.item.from }}</td>
          <td class="text-xs-left">{{ props.item.subject }}</td>
          <td class="text-xs-left">{{ props.item.dateTime }}</td>
          <td class="text-xs-left">{{ getMessageTypes[props.item.type].typeText }}</td>
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click.stop="editItem(props.item)">reply</v-icon>
            <v-icon small class="mr-2" @click.stop="editItem(props.item)">forward</v-icon>
            <v-icon small class="mr-2" @click.stop="editItem(props.item)">snooze</v-icon>
            <v-icon small @click.stop="deleteItem(props.item)">delete</v-icon>
          </td>
        </tr>
      </template>
<!--       
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
-->      
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

  export default {
    name: 'message-view',
    data: () => ({
      expand: true,
      dialog: false,
      headers: [
        { 
          text: '(*) From',
          align: 'left',
          sortable: true,
          value: 'from'
        },
        {
          text: '(*) Subject',
          align: 'left',
          sortable: true,
          value: 'subject'
        },
        {
          text: '(*) Date',
          align: 'left',
          sortable: true,
          value: 'sent'
        },
        {
          text: '(*) Type',
          align: 'left',
          sortable: true,
          value: 'type'
        }, 
        { 
          text: '(*) Actions',
          align: 'left',
          value: 'type'
        },
      ],
      //messages: [],
      editedIndex: -1,
      editedItem: {
        subject: '',
        dateTime: '',
        from: '',
        type: ''
      },
      defaultItem: {
        subject: '',
        dateTime: '',
        from: '',
        type: ''
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? '(*) New Message' : '(*) Edit Message'
      },
      ...mapGetters([
        "getMessages",
        "getMessageTypes"
      ]),
      messages() {
        return Object.values(this.getMessages)
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    methods: {
      gotoMessage(uuid) {
        console.log("Trying to move over...")
        this.$router.push("/messages/" + uuid)
      },
      editItem (item) {
        this.editedIndex = this.messages.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        const index = this.messages.indexOf(item)
        confirm('Are you sure you want to delete this item?') && 
                this.messages.splice(index, 1)
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.messages[this.editedIndex], this.editedItem)
        } else {
          this.messages.push(this.editedItem)
        }
        this.close()
      }
    }
  }
</script>