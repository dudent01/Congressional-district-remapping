import { RECIEVE_STATES, DESELECT_STATE, REQUEST_STATES, SELECT_STATE } from '../actions/types';

const intitialState = {
  geojson: null,
  states: [],
  selectedState: "", // abbreviation name e.g CA
  isFetching: false
}

export default function stateReducer(state = intitialState, action) {
  switch (action.type) {
    case REQUEST_STATES:
      return {
        ...state,
        isFetching: true
      }
    case RECIEVE_STATES:
      return {
        ...state,
        geojson: action.geojson,
        states: action.states,
        isFetching: false
      }
    case SELECT_STATE:
      return {
        ...state,
        selectedState: action.selectedState
      }
    case DESELECT_STATE:
      return {
        ...state,
        selectedState: ""
      }
    default:
      return state;
  }
}