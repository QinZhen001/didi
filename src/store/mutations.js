import * as types from './mutation-types'

const mutations = {
  [types.SET_CUR_NAV_INDEX](state, index){
    state.curNavIndex = index
  },
  [types.SET_PHONE](state, phone){
    state.phone = phone
  },
  [types.SET_START_PLACE](state, startPlace){
    state.startPlace = startPlace
  },
  [types.SET_FORMATTED_START_PLACE](state, startFormattedPlace){
    state.startFormattedPlace = startFormattedPlace
  },
  [types.SET_DESTINATION](state, destination){
    state.destination = destination
  },
  [types.SET_START_POSITION](state, startPosition){
    state.startPosition = startPosition
  },
  [types.SET_END_POSITION](state, endPosition){
    state.endPosition = endPosition
  },
  [types.SET_CUR_CITY](state, curCity){
    state.curCity = curCity
  },
  [types.SET_DRIVER](state, driver){
    state.driver = driver
  },
  [types.SET_COST](state, cost){
    state.cost = cost
  }
}

export default mutations
