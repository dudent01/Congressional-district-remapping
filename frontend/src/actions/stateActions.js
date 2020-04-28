import axios from 'axios'
import { RECIEVE_STATES, DESELECT_STATE, REQUEST_STATES, SELECT_STATE } from './types';
import { fetchPrecinctsByState } from "./precinctActions"

export const recieveStates = (states, geojson) => {
  return {
    type: RECIEVE_STATES,
    states,
    geojson
  }
}
export const requestStates = () => {
  return { type: REQUEST_STATES }
}
export const deselectState = () => {
  return {
    type: DESELECT_STATE
  }
}

// Asynchronous actions
export const fetchAllStates = () => {
  return async (dispatch) => {
    dispatch(requestStates())
    const { data } = await axios.get(process.env.REACT_APP_API_URL + "/api/state");
    data.forEach(state => state.geojson = JSON.parse(state.geojson));
    let geojson = { type: "FeatureCollection", features: data.map(state => state.geojson) }
    dispatch(recieveStates(data, geojson));
  }
}
export const selectState = selectedState => {
  return async (dispatch) => {
    dispatch({ type: SELECT_STATE, selectedState })
    dispatch(fetchPrecinctsByState(selectedState))
  }
}