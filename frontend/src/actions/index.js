import { FETCH_PRECINCT, MERGE_PRECINCT, UPDATE_PRECINCT, CREATE_GHOST_PRECINCT, FETCH_STATE, FETCH_GITHUB_DATA, SELECT_STATE, DELETE_PRECINCT, DESELECT_STATE } from './types';
import axios from 'axios';


export const fetchPrecincts = precincts => {
  return {
    type: FETCH_PRECINCT,
    precincts
  }
}

export const fetchPrecinctsByState = (abbr) => {
  return (dispatch) => {
    // return axios.get(process.env.REACT_APP_API_URL + `api/precinct/state/${abbr}`)
    return axios.get(process.env.REACT_APP_API_URL + `/api/precinct/state/${abbr}`)
      .then(({ data }) => {
        if (!data) return;
        let features = []
        for(let precinct of data) {
          features = features.concat(JSON.parse(precinct.geojson))
          delete precinct.geojson
        }
        dispatch(fetchPrecincts({ precincts: data, geojson: { type: "FeatureCollection", features } }))
      })
      .catch(error => {
        throw (error)
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
  return function (dispatch) {
    dispatch({ type: SELECT_STATE, selectedState })
    return dispatch(fetchPrecinctsByState(selectedState))
      .then(() => {
      })
      .catch(error => {
        throw (error)
      })
  }
  // return {
  //   type: SELECT_STATE,
  //   selectedState
  // }
}
export const deselectState = () => {
  return {
    type: DESELECT_STATE
  }
}

export const deleteAllPrecincts = () => {
  return {
    type: DELETE_PRECINCT
  }
}

export const fetchAllStates = () => {
  return (dispatch) => {
    return axios.get(process.env.REACT_APP_API_URL + "/api/state")
      .then(({ data }) => {
        data.forEach(state => state.geojson = JSON.parse(state.geojson))
        let states = {
          geojson: { type: "FeatureCollection", features: data.map(state => state.geojson) },
          states: data
        }
        dispatch(fetchStates(states))
      })
  }
}
