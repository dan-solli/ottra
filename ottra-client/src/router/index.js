import Vue from "vue";
import Router from "vue-router";

import Start from './../views/Start'
import LoginUser from './../views/LoginUser'
import RegisterUser from './../views/RegisterUser'
import Dashboard from './../views/Dashboard'

import LocationView from './../views/LocationView'
import MessageView from './../views/MessageView'
import SingleMessageView from './../views/SingleMessageView'
import SettingsView from './../views/SettingsView'

import LocationNewView from './../views/creation/CreateLocation'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: 'start',
      meta: { noAuthRequired: true },
      component: Start
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard
    },
    {
      path: '/login',
      name: 'login',
      meta: { noAuthRequired: true },
      component: LoginUser
    },
    {
      path: '/register',
      name: 'register',
      meta: { noAuthRequired: true },
      component: RegisterUser
    },    
    {
      path: '/location',
      name: 'location',
      component: LocationView
    },
    {
      path: '/messages',
      name: 'messages',
      component: MessageView
    },
    {
      path: '/messages/:uuid',
      name: 'single_message',
      props: true,
      component: SingleMessageView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
    {
      path: '/location/new',
      name: 'new_location',
      component: LocationNewView
    },

/*    
    {
      path: "/create",
      name: 'create',
      component: Create,
      children: [
        {
          path: 'location',
          component: CreateLocation
        }, 
        {
          path: 'room',
          component: CreateRoom
        }, 
        {
          path: 'storage',
          component: CreateStorage
        }, 
        {
          path: 'task',
          component: CreateTask
        }, 
        {
          path: 'step',
          component: CreateStep
        }, 
        {
          path: 'equipment',
          component: CreateEquipment
        }
      ]
    },
    {
      path: '/todo/:uuid',
      name: 'single_todo',
      props: true,
      component: ViewSingleTodo,
    },
*/    
    {
      path: '*',
      redirect: '/'
    }
   ]
});
