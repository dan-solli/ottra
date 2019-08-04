<template>
	<div class="create_group">
		<h1 class="subheading"> (*) Create Group </h1>

    <v-stepper v-model="current_step" vertical>
      <v-form ref="form" v-model="valid">
        <v-stepper-step step="1" :complete="current_step > 1">(*) Name the group</v-stepper-step>

        <v-stepper-content step="1">
            <v-container>
              <v-layout row>
                <v-flex xs12 md4>
                  <v-text-field v-model="group_name" :rules="stringRules" 
                    label="Name" type="text" required>
                  </v-text-field>
                </v-flex>
              </v-layout>

            </v-container>
          <v-btn color="primary" @click="current_step = current_step + 1">(*) Continue</v-btn>
          <v-btn text>(*) Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-step step="2" :complete="current_step > 2">(*) Invite members</v-stepper-step>
        <v-stepper-content step="2">
          <v-container>
            <v-layout row>
              <v-flex xs12>
                <v-list-item 
                  v-for="(inviteeRow, index) in invitees"
                  :key="index">
                  <v-list-item-icon>
                    <v-icon @click="removeFromList(index)" color="red">cancel</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title> {{ inviteeRow.username }} </v-list-item-title>
<!--
                    <v-list-item-subtitle> {{ roleLookup[inviteeRow.role] }} 
-->
                    <v-list-item-subtitle> {{ inviteeRow.role.text }} 
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12 md3>
                <v-text-field label="(*) Ottra username" type="text" required 
                  v-model="inviteeUserName">
                </v-text-field>
              </v-flex>
              <v-flex xs12 md3 mx-2>
                <v-select 
                  label="(*) As user role" 
                  :items="roles"
                  v-model="inviteeRole">
                </v-select>
              </v-flex>
              <v-flex xs12 md3>
                <v-btn @click="addInvitee">(*) Add user</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
          <v-divider horizontal></v-divider>
          <v-btn text @click="current_step = 1">(*) Restart</v-btn>
          <v-btn text @click="saveGroup">(*) Save Group and send invites</v-btn>
        </v-stepper-content>
      </v-form>
    </v-stepper>
  </div>
</template>

<script>

export default {
  name: "create-group",
  data: () => ({
    current_step: 1,
    inviteeUserName: '',
    inviteeRole: 'helper',
    roles: [ 
      {
        text: '(*) Admin',
        value: 'admin'
      },
      {
        text: '(*) Family',
        value: 'family'
      },
      {
        text: '(*) Ombud',
        value: 'ombud'
      },
      {
        text: '(*) Helper',
        value: 'helper'
      }
    ],
    invitees: [ 
    ],
  	group_name: '',
    valid: false,
    stringRules: [
      v => !!v || 'Required'
    ],
  }),
  methods: {
    saveGroup: function() {
      const payload = {
        groupName: this.group_name,
        invitees: this.invitees.map(x => {
          return {
            username: x.username,
            role: x.role.value
          }
        })
      }
      return this.$store.dispatch("createGroup", payload)
      .then((data) => {
        this.$router.push('/group')
      })
      .catch(function(err) {
        console.log("THIS IS A FUCKING ERROR FOR NO GOD DAMNED REASON!")
        console.log("Error is: " + err)
      })
    },
    removeFromList: function(index) {
      this.invitees.splice(index, 1)
    },
    addInvitee: function() {
      this.invitees.push({ 
        username: this.inviteeUserName, 
        role: this.roles.find(x => x.value == this.inviteeRole)
      })
      this.inviteeUserName = ''
      this.inviteeRole = {
        text: '(*) Helper',
        value: 'helper'
      }
      console.log(this.invitees)
    }
  }
};
</script>

