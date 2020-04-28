import { FETCH_PRECINCT, MERGE_PRECINCT, UPDATE_PRECINCT, CREATE_GHOST_PRECINCT, DELETE_PRECINCT, FETCH_ELECTION, SET_SELECTED_PRECINCT } from '../actions/types';

const initialState = {
  precincts: [],
  selectedPrecinct: null,
  geojson: null
}

export default function precinctReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRECINCT:
      return {
        ...state,
        precincts: action.precincts,
        geojson: action.geojson
      };
    case DELETE_PRECINCT:
      return Object.assign({}, state, initialState)
    case FETCH_ELECTION:
      return {
        ...state,
        selectedPrecinct: {
          ...state.selectedPrecinct,
          election: action.election
        }
      }
    case SET_SELECTED_PRECINCT:
      return {
        ...state,
        selectedPrecinct: action.precinct
      }
    default:
      return state;
  }
}