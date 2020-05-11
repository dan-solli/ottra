import Vue from "vue";
import Router from "vue-router";

import JwtService from '@/common/jwt.service'


import Start from './../views/Start'
import LoginUser from './../views/LoginUser'
import RegisterUser from './../views/RegisterUser'
import Dashboard from './../views/Dashboard'

import CreateBaseView from '@/views/CreateBaseView'

import FileBrowserView from './../views/FileBrowserView'
import LocationView from './../views/LocationView'
import MessageView from './../views/MessageView'
import SingleMessageView from './../views/SingleMessageView'
import SettingsView from './../views/SettingsView'
import GroupView from './../views/GroupView'
import TodoView from '@/views/TodoView'

import LocationNewView from './../views/creation/CreateLocation'
import CreateGroup from './../views/creation/CreateGroup'

import RoomNewView from './../views/creation/CreateRoom'
import RoomView from './../views/RoomView'

import StorageNewView from './../views/creation/CreateStorage'
import StorageView from './../views/StorageView'

import EquipmentNewView from './../views/creation/CreateEquipment'
import EquipmentView from './../views/EquipmentView'

import CreateTodo from './../views/creation/CreateTodo'

import TaskView from '@/views/TaskView'
import CreateTask from './../views/creation/CreateTask'
import AddStepsToTask from '@/views/creation/AddStepsToTask'
import CreateStep from './../views/creation/CreateStep'

import PlanBaseView from '@/views/plan/PlanBaseView'
import PlanView from '@/views/plan/PlanView'
import ScheduleView from '@/views/plan/ScheduleView'

import store from '../store'

Vue.use(Router);

const router = new Router({
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
        if (store.state.User.isAuthenticated) {
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
        if (store.state.User.isAuthenticated) {
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
      path: '/create',
      name: 'base_create',
      component: CreateBaseView,
      children: [
        {
          path: '/location/new',
          name: 'new_location',
          component: LocationNewView
        },
        {
          path: '/location',
          name: 'location',
          component: LocationView
        },
        {
          path: '/room/new',
          name: 'new_room',
          component: RoomNewView
        },
        {
          path: '/room/new/:location_uuid',
          name: 'new_room_with_id',
          props: true,
          component: RoomNewView
        },
        {
          path: '/room',
          name: 'room',
          component: RoomView
        },
        {
          path: '/storage/new',
          name: 'new_storage',
          component: StorageNewView
        },
        {
          path: '/storage/new/:container_uuid',
          name: 'new_storage_with_id',
          props: true,
          component: StorageNewView
        },
        {
          path: '/storage',
          name: 'storage',
          component: StorageView
        },
        {
          path: '/equipment/new',
          name: 'new_equipment',
          component: EquipmentNewView
        },
        {
          path: '/equipment/new/:container_uuid',
          name: 'new_equipment_with_id',
          props: true,
          component: EquipmentNewView
        },
        {
          path: '/equipment',
          name: 'equipment',
          component: EquipmentView
        },
        {
          path: '/todo',
          name: 'view_todos',
          component: TodoView
        },
        {
          path: '/todo/:todo_uuid',
          name: 'edit_todo',
          props: true,
          component: CreateTodo
        },
        {
          path: '/task',
          name: 'view_tasks',
          component: TaskView
        },
        {
          path: '/task/new',
          name: 'new_task',
          component: CreateTask
        },
        {
          path: '/task/:task_uuid',
          name: 'add_steps_to_task',
          props: true,
          component: AddStepsToTask,
        },
        { 
          path: '/step/:step_uuid',
          name: 'new_step',
          props: true,
          component: CreateStep,
        },
        { 
          path: '/step/:step_uuid',
          name: 'edit_step',
          props: true,
          component: CreateStep,
        }
      ]
    },
    {
      path: '/plan',
      name: 'base_plan',
      component: PlanBaseView,
      children: [
        {
          path: '/planview',
          name: 'plan_view',
          props: true,
          component: PlanView,
        },
        {
          path: '/schedule',
          name: 'schedule_view',
          props: true,
          component: ScheduleView,
        },
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
   ]
});

export default router