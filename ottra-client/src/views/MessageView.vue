<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>
        {{ $t('ui.view.messageview.heading') }}
      </v-toolbar-title>
  
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">
            {{ $t('ui.view.messageview.newmessage')}}
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.from" 
                    :label="$t('domobj.messages.from')">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.subject" 
                    :label="$t('domobj.messages.subject')">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.dateTime"
                    :label="$t('ui.text.date')">
                  </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.type"
                    :label="$t('domobj.messages.type')">
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">
              {{ $t('ui.text.cancel') }} 
            </v-btn>
            <v-btn color="blue darken-1" flat @click="save">
              {{ $t('ui.text.save') }}
            </v-btn>
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
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small class="mr-2" @click.stop="editItem(props.item)">reply</v-icon>
              </template>
              {{ $t('ui.tooltip.reply') }}
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small class="mr-2" @click.stop="editItem(props.item)">forward</v-icon>
              </template>
              {{ $t('ui.tooltip.forward') }}
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small class="mr-2" @click.stop="editItem(props.item)">snooze</v-icon>
              </template>
              {{ $t('ui.tooltip.snooze') }}
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small @click.stop="deleteItem(props.item)">delete</v-icon>
              </template>
              {{ $t('ui.tooltip.delete') }}
            </v-tooltip>
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
      headers() {
        return [
          { 
            text: this.$t('domobj.messages.from'),
            align: 'left',
            sortable: true,
            value: 'from'
          },
          {
            text: this.$t('domobj.messages.subject'),
            align: 'left',
            sortable: true,
            value: 'subject'
          },
          {
            text: this.$t('ui.text.date'),
            align: 'left',
            sortable: true,
            value: 'sent'
          },
          {
            text: this.$t('domobj.messages.type'),
            align: 'left',
            sortable: true,
            value: 'type'
          }, 
          { 
            text: this.$t('ui.text.actions'),
            align: 'left',
            value: 'type'
          },
        ]
      },
      formTitle () {
        return this.editedIndex === -1 ? 
          this.$t('ui.view.messageview.newmessage') : 
          this.$t('ui.view.messageview.editmessage')
      },
      ...mapGetters([
        "getMessages",
        "getMessageTypes"
      ]),
      messages() {
        return Object.values(this.getMessages)
      },
      confirmDeleteMessage() {
        return this.$t('ui.dialog.confirmdelete')
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    methods: {
      gotoMessage(uuid) {
        console.debug("%s: gotoMessage: Trying to move over...", __filename)
        this.$router.push("/messages/" + uuid)
      },
      editItem (item) {
        this.editedIndex = this.messages.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        const index = this.messages.indexOf(item)
        confirm(this.confirmDeleteMessage) && 
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
    },
    mounted() {
      this.$store.dispatch("loadMessages")
    }
  }
</script>