<template>
	<div id="dashboard">

    <v-container fluid grid-list-xl>
      
      <v-layout row wrap>

        <v-flex md3>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon>
                <v-icon>keyboard_arrow_left</v-icon>
              </v-btn>
            </template>
            {{ $t('ui.text.previous') }}
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-btn>
            </template>
            {{ $t('ui.text.next') }}
          </v-tooltip>
          <v-sheet height="700">
            <v-calendar 
              color="primary" 
              type="day"
              :start="currentDate">
              <template v-slot:dayHeader="{ present }">
                <template v-if="present" class="text-xs-center">
                  {{ $t('ui.calendar.today') }}
                </template>
              </template>
              <template v-slot:interval="{ hour }">
                <div class="text-xs-center">
                  {{ hour }} 
                </div>
              </template>
            </v-calendar>
          </v-sheet>
        </v-flex>
        <v-flex md9>

          <v-layout row wrap>

            <v-flex md4>
              <OttraWidget type="info">
                <template slot="title">
                  {{ $t('ui.dashboard.todaysagenda') }}: {{ todaysDate }} 
                </template>
                <p v-for="e in getEventsByDate">
                  {{ e.start.dateTime.slice(0, 5) }}: 
                  <v-avatar color="light-blue" size="18px">
                    <span> {{ getEventType(e.type) }} </span>
                  </v-avatar>
                  {{ e.description }}
                </p>
              </OttraWidget>
            </v-flex>

            <v-flex v-if="getMessageUnreadCount" md4>
              <OttraWidget type="info">
                <template slot="title">
                  {{ $t('domobj.messages.unread') }}
                </template>
                <p v-for="m in getMessagesUnread">
                  {{ m.dateTime }}: 
                  {{ m.from }}: 
                  {{ m.subject }}
                </p>
              </OttraWidget>
            </v-flex>

          </v-layout>

        </v-flex>
      </v-layout>
    </v-container>
	 </div>
</template>

<script>

import { mapGetters } from "vuex";

import OttraWidget from '@/components/OttraWidget'

export default {
  name: 'dashboard',
  components: {
    OttraWidget
  },
  data: function() {
    return {
      currentDate: ''
    }
  },
  computed: {
    ...mapGetters([
      "todaysDate",
      "getEvents",
      "getMessagesUnread",
      "getMessageUnreadCount"
    ]),
    getEventsByDate: function() {
      let theDate = this.currentDate

      return Object.values(this.getEvents)
        .filter(ob => ob.start.date === theDate)
        .sort((a, b) => b.start.dateTime - a.start.dateTime)
        .reverse()
    },
  },
  methods: {
    getEventType: function(event_type) {
      // this.$log.debug(event_type)
      const arr = event_type.split('#')
      return arr[1].slice(0,1).toUpperCase()
    }    
  },
  created: function() {
    // Set up context sensitive stuff.
    // For each widget, load data from backend:
    // - Userdata
    // - Plans
    // - Calendar
    // - Todo
    // - Tasks
    // - Maybe a weather-blob
  },
  mounted: function() {
    this.currentDate = this.todaysDate
  }
}
</script>
