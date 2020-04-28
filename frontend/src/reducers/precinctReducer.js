import {
  REQUEST_PRECINCTS, RECEIVE_PRECINCTS, DELETE_PRECINCTS, SET_SELECTED_PRECINCT,
  REQUEST_SELECTED_PRECINCT_DATA, RECIEVE_SELECTED_PRECINCT_DATA, SET_PRECINCT_GEOJSON
} from '../actions/types';

const initialState = {
  precincts: [],
  selectedPrecinct: null,
  geojson: null,
  isFetching: false,
  isFetchingSelectedPrecinct: false // If selecting demo/election data for clicked precinct.
}

export default function precinctReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_PRECINCTS:
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_PRECINCTS:
      return {
        ...state,
        isFetching: false,
        precincts: action.precincts,
        geojson: action.geojson
      }
    case DELETE_PRECINCTS:
      return initialState
    case REQUEST_SELECTED_PRECINCT_DATA:
      return {
        ...state,
        isFetchingSelectedPrecinct: true
      }
    case RECIEVE_SELECTED_PRECINCT_DATA:
      return {
        ...state,
        selectedPrecinct: {
          ...state.selectedPrecinct,
          election: action.election
        },
        isFetchingSelectedPrecinct: false
      }
    case SET_SELECTED_PRECINCT:
      return {
        ...state,
        selectedPrecinct: action.precinct
      }
    case SET_PRECINCT_GEOJSON: 
      const index = state.geojson.features.findIndex(p => p.id === action.id)
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: [
            ...state.geojson.features.slice(0, index),
            action.geojson,
            ...state.geojson.features.slice(index + 1)
          ]
        }
      }
    default:
      return state;
  }
}