import { FETCH_STATE, SELECT_STATE, DESELECT_STATE } from '../actions/types';

const intitialState = {
  geojson: null,
  states: [],
  selectedState: "" // abbreviation name e.g CA
}

export default function stateReducer(state = intitialState, action) {
  switch (action.type) {
    case FETCH_STATE:
      return action.states
    case SELECT_STATE: 
      return Object.assign({}, state, {
        selectedState: action.selectedState
      })
    case DESELECT_STATE:
      return Object.assign({}, state, {
        selectedState: ""
      })
    default:
      return state;
  }
}