import Vue from "vue";
import Router from "vue-router";

import Start from './../views/Start'
import LoginUser from './../views/LoginUser'
import RegisterUser from './../views/RegisterUser'
import Dashboard from './../views/Dashboard'

import FileBrowserView from './../views/FileBrowserView'
import LocationView from './../views/LocationView'
import MessageView from './../views/MessageView'
import SingleMessageView from './../views/SingleMessageView'
import SettingsView from './../views/SettingsView'
import GroupView from './../views/GroupView'

import LocationNewView from './../views/creation/CreateLocation'
import CreateGroup from './../views/creation/CreateGroup'

import store from '../store'

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
      component: LoginUser,
      beforeEnter: (to, from, next) => {
        if (store.state.isAuthenticated) {
          next("/dashboard")
        } else {
          next()
        }
      }
    },
    {
      path: '/register',
      name: 'register',
      meta: { noAuthRequired: true },
      component: RegisterUser,
      beforeEnter: (to, from, next) => {
        if (store.state.isAuthenticated) {
          next("/dashboard")
        } else {
          next()
        }
      }
    },    
    {
      path: '/filebrowser',
      name: 'filebrowser',
      component: FileBrowserView
    },
    {
      path: '/location',
      name: 'location',
      component: LocationView
    },
    {
      path: '/group',
      name: 'group',
      component: GroupView
    },    
    {
      path: '/group/new',
      name: 'new_group',
      component: CreateGroup
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
