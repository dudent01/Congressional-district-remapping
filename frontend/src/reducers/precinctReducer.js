import { FETCH_PRECINCT, MERGE_PRECINCT, UPDATE_PRECINCT, CREATE_GHOST_PRECINCT, DELETE_PRECINCT } from '../actions/types';

const initialState = {
  precincts: [],
  selectedPrecinct: {},
  geojson: null
}

export default function precinctReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRECINCT:
      return action.precincts;
    case DELETE_PRECINCT:
      return Object.assign({}, state, initialState)
    default:
      return state;
  }
}