import Vue from 'vue'
import Vuex from 'vuex'

/*
import { RepositoryFactory } from '@/common/repos/RepositoryFactory'

const StorageRepo = RepositoryFactory.get('storage')
*/

const Storage = {
	state: {
    storages : {
      "Storage01":
      {
        "uuid": "Storage01",
        "Name": "Pappersåtervinning"
      },
      "Storage02":
      {
        "uuid": "Storage02",
        "Name": "Plaståtervinning"
      },
      "Storage03":
      {
        "uuid": "Storage03",
        "Name": "Hushållssopor"
      },
      "Storage04":
      {
        "uuid": "Storage04",
        "Name": "Kompost"
      },
      "Storage05":
      {
        "uuid": "Storage05",
        "Name": "Färgat glas"
      },
      "Storage06":
      {
        "uuid": "Storage06",
        "Name": "Genomskinligt glas"
      },
      "Storage07":
      {
        "uuid": "Storage07",
        "Name": "Sopkorg",
        "Actions": 
        [
          "Action01",
          "Action02",
          "Action03"
        ]
      },
      "Storage08":
      {
        "Name": "Skohylla",
        "uuid": "Storage08",
        "Equipment":
        [
          "Eq01"
        ]
      },
      "Storage09":
      {
        "Name": "Städskåp",
        "uuid": "Storage09",
        "Equipment":
        [
          "Eq02",
          "Eq03"
        ]
      },
      "Storage10":
      {
        "Name": "Hallskåp",
        "uuid": "Storage10",
        "Equipment":
        [
          "Eq04"
        ]
      },
      "Storage11":
      {
        "Name": "Nyckelskåp",
        "uuid": "Storage11",
        "Equipment":
        [
          "Eq05"
        ]
      }
    }
	},
	mutations: {
	},
	getters: {
  	getStorages: state => Object.keys(state.storages),
    getStorageByID: (state) => (id) => { 
      return state.storages.id
    }
	},
	actions: {
	}
}

export default Storage