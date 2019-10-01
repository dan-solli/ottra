<template>
  <v-content>
    <form-wrapper :validator="$v.form">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar>
                <v-toolbar-title> 
                  {{ $t('ui.dialog.login.title') }} 
                  ({{ submitStatus }}) 
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" text icon @click="startTour">
                      <v-icon>help_outline</v-icon>
                    </v-btn>
                  </template>
                  {{ $t('ui.tooltip.starttour') }}                  
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" text icon @click="closeDialog">
                      <v-icon>clear</v-icon>
                    </v-btn>
                  </template>
                  {{ $t('ui.text.close') }}                  
                </v-tooltip>
              </v-toolbar>
              <!-- <form-summary></form-summary> -->
              <v-card-text>
                <v-form @submit.prevent="submit">
                  <form-group name="email">
                    <v-text-field 
                      class="tour-step-1"
                      required
                      slot-scope="{ attrs }"
                      v-bind="attrs"
                      v-model="form.email"
                      prepend-icon="person"
                      name="login"
                      :label="userFieldLabel"
                      @input="$v.form.email.$touch()"
                      type="text">
                    </v-text-field>
                  </form-group>
                  <form-group name="passwd1">
                    <v-text-field 
                      required
    			          	v-model="form.passwd1"
                      slot-scope="{ attrs }"
                      v-bind="attrs"
    			            :append-icon="show1 ? 'visibility_off' : 'visibility'"
    	               	prepend-icon="lock"
    			            :type="show1 ? 'text' : 'password'"
    			            name="passwd1"
    			            :label="passwdFieldLabel"
    			            :hint="passwdFieldHint"
    			            value=""
                      @input="$v.form.passwd1.$touch()"
    			            class="input-group--focused tour-step-2"
    			            @click:append="show1 = !show1"
                    ></v-text-field>
                  </form-group>
                </v-form>
              </v-card-text>
              <v-card-actions>
                {{ $t('ui.dialog.login.nouser') }}?&nbsp; 
                <router-link :to="{ path: '/register' }">
                  {{ $t('ui.dialog.login.signoneup') }}
                </router-link>
  							<v-spacer></v-spacer>
                <v-btn 
                  v-shortkey.push="['enter']" @shortkey="loginUser"
                  color="primary" 
                  class="tour-step-4"
                  @click="loginUser">
                    {{ $t('ui.dialog.login.loginbutton') }} 
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </form-wrapper>

    <v-tour name="LoginUserTour" :steps="tourSteps" :options="tourLabels"></v-tour>
  </v-content>
</template>


<script>
import { required, email, sameAs, minLength, requiredIf } from 'vuelidate/lib/validators'
import { RepositoryFactory } from '@/common/repos/RepositoryFactory'
import { mapActions } from "vuex";

// import store from '@/store'

const UserRepo = RepositoryFactory.get('user')

export default {
  name: "login-user-view",
  data: () => ({
    register_new_user: false,
    form: {
      email: "",
      passwd1: "",
    },
  	isLoading: false,
    show1: false,
    submitStatus: 'Indetermined',
	}),
  mounted: function() {
    console.debug("%s: In mounted(). Params are: %O", __filename, this.$route.params)
    this[this.$route.params.directive] = true
  },
  validations: function() {
    return {
      form: {
        email: {
          required, 
          email,
          minLength: minLength(6)
        },
        passwd1: {
          required,
          minLength: minLength(10)
        }
      }
    }
  },  
	methods: {
		loginUser: function() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.submitStatus = "ERROR"
        console.error("%s: loginUser: Form is invalid...", __filename)
      } else {
        const payload = {
          username: this.form.email,
          password: this.form.passwd1
        }
        return this.$store.dispatch("loginUser", payload)
        .then((data) => {
          this.$router.push('/dashboard')
        })
        .catch(function(err) {
          console.error("%s: loginUser: Error is: %s", __filename, err)
        })
      }
		},
    startTour: function() {
      this.$tours['LoginUserTour'].start()
    },
    closeDialog: function() {
      this.$router.push('/')
    }
	},
  computed: {
    passwdFieldHint: function() {
      return this.$t('ui.dialog.login.passwordfield.hint')
    },
    passwdFieldLabel: function() {
      return this.$t('ui.dialog.login.passwordfield.label')
    },
    passwdConfirmFieldLabel: function() {
      return this.$t('ui.dialog.login.passwordconfirmfield.label')
    },
    userFieldLabel: function() {
      return this.$t('ui.dialog.login.userfield.label')
    },
    tourLabels: function() {
      return {
        labels: {
          buttonSkip: this.$t('ui.tour.buttonSkip'),
          buttonPrevious: this.$t('ui.tour.buttonPrevious'),
          buttonNext: this.$t('ui.tour.buttonNext'),
          buttonStop: this.$t('ui.tour.buttonStop')
        }
      }
    },
    tourSteps: function() {
      return [
        { 
          target: '.tour-step-1',
          content: this.$t('ui.tour.loginuser.step1'),
          params: {
            placement: 'left'
          }
        },
        { 
          target: '.tour-step-2',
          content: this.$t('ui.tour.loginuser.step2'),
          params: {
            placement: 'left'
          }
        },
        { 
          target: '.tour-step-4',
          content: this.$t('ui.tour.loginuser.step4'),
          params: {
            placement: 'right'
          }
        },
      ]
    }
  }
};
</script>
