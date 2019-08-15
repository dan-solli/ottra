<template>
	<div class="create_group">
		<h1 class="subheading"> {{ $t('ui.view.creategroup.heading')}} </h1>

    <v-stepper v-model="current_step" vertical>
      <v-form ref="form" v-model="valid">
        <v-stepper-step step="1" :complete="current_step > 1">{{$t('ui.view.creategroup.namethegroup') }}</v-stepper-step>

        <v-stepper-content step="1">
            <v-container>
              <v-layout row>
                <v-flex xs12 md4>
                  <v-text-field v-model="group_name" :rules="stringRules" 
                    :label="$t('ui.text.name')" type="text" required>
                  </v-text-field>
                </v-flex>
              </v-layout>

            </v-container>
          <v-btn color="primary" @click="SaveGroup">{{ $t('ui.view.creategroup.btncreateandcontinue')}}</v-btn>
          <v-btn text> {{ $t('ui.text.cancel') }} </v-btn>
        </v-stepper-content>

        <v-stepper-step step="2" :complete="current_step > 2"> {{ $t('ui.view.creategroup.invitemembers') }}</v-stepper-step>
        <v-stepper-content step="2">
          <v-container>
            <v-layout row>
              <v-flex xs12>
                <v-list-item 
                  v-for="(inviteeRow, index) in invitees"
                  :key="index">
                  <v-list-item-content >
                    <v-list-item-title> 
                      {{ inviteeRow.username }} 
                    </v-list-item-title>
                    <v-list-item-subtitle> 
                      {{ inviteeRow.role.text }} 
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" @click="removeFromList(index)" color="red">cancel</v-icon>
                      </template>
                      {{ $t('ui.tooltip.delete')}}
                    </v-tooltip>
                  </v-list-item-icon>
                </v-list-item>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12 md3>
                <v-text-field :label="$t('ui.view.creategroup.ottrausername')" type="text" required 
                  v-model="inviteeUserName">
                </v-text-field>
              </v-flex>
              <v-flex xs12 md3 mx-2>
                <v-select 
                  :label="$t('ui.view.creategroup.asrole')" 
                  :items="roles"
                  v-model="inviteeRole">
                </v-select>
              </v-flex>
              <v-flex xs12 md3>
                <v-btn @click="addInvitee">
                {{ $t("ui.view.creategroup.addinvitation") }} </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
          <v-divider horizontal></v-divider>
          <v-btn text @click="current_step = 1">{{ $t('ui.text.restart') }}</v-btn>
          <v-btn text @click="sendInvites">{{ $t('ui.view.creategroup.sendinvites') }}</v-btn>
        </v-stepper-content>
      </v-form>
    </v-stepper>
  </div>
</template>

<script>

import { LOADING, OK, ERROR } from '@/types/loadstate.type'

export default {
  name: "create-group",
  data: () => ({
    current_step: 1,
    inviteeUserName: '',
    inviteeRole: 'helper',
    roles: [ 
      {
        text: $t('ui.group.rolename.admin'),
        value: 'admin'
      },
      {
        text: $t('ui.group.rolename.family'),
        value: 'family'
      },
      {
        text: $t('ui.group.rolename.ombud'),
        value: 'ombud'
      },
      {
        text: $t('ui.group.rolename.helper'),
        value: 'helper'
      }
    ],
    invitees: [ 
    ],
  	group_name: '',
    valid: false,
    group_id: null,
    stringRules: [
      v => !!v || this.$t('ui.text.required')
    ],
    controlStates: {}
  }),
  methods: {
    saveGroup: async function() {
      const payload = {
        groupName: this.group_name,
      }
      this.group_id = await this.$store.dispatch("createGroup", payload)
      this.current_step++
    },
    sendInvites: async function() {
      const payload = {
        invitees: this.invitees.map(x => {
          return {
            username: x.username,
            role: x.role.value
          }
        })
      }
      await this.$store.dispatch("sendGroupInvites", payload)
      this.$router.push('/group')
    },
    removeFromList: function(index) {
      this.invitees.splice(index, 1)
    },
    addInvitee: function() {
      this.controlStates[this.inviteeUserName] = LOADING
      this.$store.dispatch("userExist", this.inviteeUserName)
      .then(function(response) {
        this.controlStates[this.inviteeUserName] = response ? OK : FAIL
      })
      .catch(function(err) {
        this.controlStates[this.inviteeUserName] = FAIL
      })
      this.invitees.push({ 
        username: this.inviteeUserName, 
        role: this.roles.find(x => x.value == this.inviteeRole)
      })
      this.inviteeUserName = ''
      this.inviteeRole = {
        text: $t('ui.group.rolename.helper'),
        value: 'helper'
      }
      this.$log.debug(this.invitees)
    }
  }
};
</script>

