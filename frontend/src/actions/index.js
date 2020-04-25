import { FETCH_PRECINCT, MERGE_PRECINCT, UPDATE_PRECINCT, CREATE_GHOST_PRECINCT, FETCH_STATE, FETCH_GITHUB_DATA, SELECT_STATE } from './types';
import axios from 'axios';


export const fetchPrecincts = precincts => {
  return {
    type: FETCH_PRECINCT,
    precincts
  }
}

export const fetchPrecinctsByState = abbr => {
  return (dispatch) => {
    return axios.get(process.env.REACT_APP_API_URL + `api/precinct/state/${abbr}`)
      .then(response => {
        dispatch(fetchPrecincts(response.data))
      })
      .catch(error => {
        throw(error)
      })
  }
}

export const fetchStates = (states) => {
  return {
    type: FETCH_STATE,
    states
  }
}

export const selectState = selectedState => {
  console.log(selectedState)
  // return (dispatch) => {
  //   dispatch(fetchPrecinctsByState(selectedState))
  // }
  return {
    type: SELECT_STATE,
    selectedState
  }
}

export const fetchAllStates = () => {
  return (dispatch) => {
    return axios.get(process.env.REACT_APP_API_URL + "/api/state")
    .then(({data}) => {
      data.forEach(state => state.geojson = JSON.parse(state.geojson))
      let states = {
        geojson: {type: "FeatureCollection", features: data.map(state => state.geojson)},
        states: data.map(state => {
          return {name: state.name, abbr: state.abbr}
        })
      }
      dispatch(fetchStates(states))
    })
  }
}
