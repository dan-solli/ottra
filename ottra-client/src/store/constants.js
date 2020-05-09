import Vue from 'vue'

const OttraConstants = {
	state: {
    ottraConstants : {
      "TRANSPORT/FOOT": 1,
      "TRANSPORT/BUS": 2,
      "TRANSPORT/CAR": 3,
      "TRANSPORT/TRAIN": 4,
      "TRANSPORT/PLANE": 5,
      "TRANSPORT/BICYCLE": 6,
      "TRANSPORT/OTHER": 7,
      "VIEWMODE/THUMB": 1,
      "VIEWMODE/DETAILED": 2,
    },
	},
	getters: {
    getOC: (state) => (id) => { 
      return state.ottraConstants[id]
    },
  }
}

export default OttraConstants