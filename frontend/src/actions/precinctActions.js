import {
  DELETE_PRECINCTS, REQUEST_PRECINCTS, RECEIVE_PRECINCTS, REQUEST_SELECTED_PRECINCT_DATA, RECIEVE_SELECTED_PRECINCT_DATA,
  SET_SELECTED_PRECINCT
} from './types';
import axios from 'axios';

// Synchronous actions
export const deletePrecincts = () => ({ type: DELETE_PRECINCTS })
export const requestPrecincts = () => ({ type: REQUEST_PRECINCTS })
export const requestSelectedPrecinctData = () => ({ type: REQUEST_SELECTED_PRECINCT_DATA })
export const recieveSelectedPrecinctData = election => ({ type: RECIEVE_SELECTED_PRECINCT_DATA, election })
export const setSelectedPrecinct = precinct => {
  return {
    type: SET_SELECTED_PRECINCT,
    precinct
  }
}
export const recievePrecincts = (precincts, geojson) => {
  return {
    type: RECEIVE_PRECINCTS,
    precincts,
    geojson
  }
}

// Asynchronous actions
export const fetchPrecinctData = (id, election, precincts) => {
  return async (dispatch) => {
    const selectedPrecinct = precincts.find(p => p.id === id)
    dispatch(setSelectedPrecinct(selectedPrecinct))
    dispatch(requestSelectedPrecinctData())
    const { data } = await axios.get(process.env.REACT_APP_API_URL + `/api/precinct/${id}/${election}`);
    dispatch(recieveSelectedPrecinctData(data[0]));
  }
}
export const fetchPrecinctsByState = (abbr) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(process.env.REACT_APP_API_URL + `/api/precinct/state/${abbr}`);
      let features = [];
      for (let precinct of data) {
        precinct.geojson = JSON.parse(precinct.geojson)
        precinct.geojson.properties.id = precinct.id  // Set id in geojson for use in the Leaflet API onClick handler
        features = features.concat(precinct.geojson);
        delete precinct.geojson;
      }
      let geojson = { type: "FeatureCollection", features };
      dispatch(recievePrecincts(data, geojson));
    }
    catch (error) {
      throw (error);
    }
  }
}