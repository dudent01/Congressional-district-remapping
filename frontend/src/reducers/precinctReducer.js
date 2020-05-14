import {
  REQUEST_PRECINCTS, RECEIVE_PRECINCTS, DELETE_PRECINCTS, SET_SELECTED_PRECINCT,
  REQUEST_SELECTED_PRECINCT_DATA, RECIEVE_SELECTED_PRECINCT_DATA, SET_PRECINCT_GEOJSON,
  ADD_NEIGHBOR, DELETE_NEIGHBOR, MERGE_PRECINCTS, SET_SECOND_SELECTED_PRECINCT, UPDATE_GEOJSON_KEY, UPDATE_PRECINCT, UPDATE_ELECTION
} from '../actions/types';

const initialState = {
  precincts: [],
  selectedPrecinct: null,
  secondSelectedPrecinct: null,
  geojson: null,
  geojsonKey: 0, // used in StateMap for rerendering the geojson
  isFetching: false,
  isFetchingSelectedPrecinct: false // If selecting demo/election data for clicked precinct.
}

export default function precinctReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_GEOJSON_KEY:
      return {
        ...state,
        geojsonKey: state.geojsonKey + 1
      }
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
          election: action.election,
          neighbors: action.neighbors
        },
        isFetchingSelectedPrecinct: false
      }
    case SET_SELECTED_PRECINCT:
      return {
        ...state,
        selectedPrecinct: action.precinct
      }
    case SET_SECOND_SELECTED_PRECINCT:
      return {
        ...state,
        secondSelectedPrecinct: action.precinct
      }
    case SET_PRECINCT_GEOJSON:
      if (state.geojson == null) {
        return state
      }
      const index = state.geojson.features.findIndex(p => p.properties.id === action.id)
      if (index < 0) {
        return state
      }
      action.geojson.properties.id = action.id
      return {
        ...state,
        geojson: {
          ...state.geojson,
          features: [
            ...state.geojson.features.slice(0, index),
            action.geojson,
            ...state.geojson.features.slice(index + 1)
          ]
        },
        geojsonKey: state.geojsonKey + 1
      }
    case ADD_NEIGHBOR:
      return {
        ...state,
        selectedPrecinct: {
          ...state.selectedPrecinct,
          neighbors: [
            ...state.selectedPrecinct.neighbors,
            action.neighborId
          ]
        }
      }
    case DELETE_NEIGHBOR:
      let neighborIndex = state.selectedPrecinct.neighbors.findIndex(id => id === action.neighborId)
      if (neighborIndex < 0) return state;
      return {
        ...state,
        selectedPrecinct: {
          ...state.selectedPrecinct,
          neighbors: [
            ...state.selectedPrecinct.neighbors.slice(0, neighborIndex),
            ...state.selectedPrecinct.neighbors.slice(neighborIndex + 1)
          ]
        }
      }
    case MERGE_PRECINCTS:
      let geojson = JSON.parse(action.precinct.geojson);
      geojson.properties.id = action.precinct.id;
      geojson.properties.name = action.precinct.name
      return {
        ...state,
        precincts: [...state.precincts.filter(p => p.id !== action.id1 && p.id !== action.id2), action.precinct],
        selectedPrecinct: action.precinct,
        geojson: {
          ...state.geojson,
          features: [...state.geojson.features.filter(p => p.properties.id !== action.id1 && p.properties.id !== action.id2), geojson]
        },
        geojsonKey: state.geojsonKey + 1
      }
    case UPDATE_PRECINCT:
      let { cName, name, id } = action.data;
      let precinctsIndex = state.precincts.findIndex(p => p.id === id);
      let precinct = state.precincts[precinctsIndex];
      precinct.name = name;
      precinct.cname = cName;

      let geojsonIndex = state.geojson.features.findIndex(p => p.properties.id === id);
      let geojson1 = state.geojson.features[geojsonIndex];
      geojson1.name = name;

      return {
        ...state,
        selectedPrecinct: {
          ...state.selectedPrecinct,
          cname: cName,
          name: name
        },
        precincts: [
          ...state.precincts.slice(0, precinctsIndex),
          precinct,
          ...state.precincts.slice(precinctsIndex+ 1)
        ],
        geojson: {
          ...state.geojson,
          features: [
            ...state.geojson.features.slice(0, geojsonIndex),
            geojson1,
            ...state.geojson.features.slice(geojsonIndex + 1)
          ]
        }
      }
    case UPDATE_ELECTION:
      return {
        ...state,
        selectedPrecinct: {
          ...state.selectedPrecinct,
          election: action.election
        }
      }
    default:
      return state;
  }
}