import axios from 'axios'
import { RECIEVE_STATES, DESELECT_STATE, REQUEST_STATES, SELECT_STATE } from './types';
import { fetchPrecinctsByState } from "./PrecinctActions"

// Synchronous actions
export const recieveStates = (states, geojson) => ({ type: RECIEVE_STATES, states, geojson })
export const requestStates = () => ({ type: REQUEST_STATES })
export const deselectState = () => ({ type: DESELECT_STATE })

// Asynchronous actions
export const fetchAllStates = () => {
  return async (dispatch) => {
    dispatch(requestStates())
    const { data } = await axios.get(process.env.REACT_APP_API_URL + "/api/state");
    data.forEach(s => {
      s.geojson = JSON.parse(s.geojson)
      s.geojson.properties.id = s.id;
      s.geojson.properties.abbr = s.abbr
    })
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