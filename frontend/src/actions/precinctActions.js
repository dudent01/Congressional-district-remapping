import {
  DELETE_PRECINCTS, REQUEST_PRECINCTS, RECEIVE_PRECINCTS, REQUEST_SELECTED_PRECINCT_DATA, RECIEVE_SELECTED_PRECINCT_DATA,
  SET_SELECTED_PRECINCT
} from './types';
import axios from 'axios';

export const deletePrecincts = () => {
  return {
    type: DELETE_PRECINCTS
  }
}
export const requestPrecincts = () => {
  return { type: REQUEST_PRECINCTS }
}
export const recievePrecincts = (precincts, geojson) => {
  return {
    type: RECEIVE_PRECINCTS,
    precincts,
    geojson
  }
}
export const fetchSelectedPrecinctData = () => {
  return { type: REQUEST_SELECTED_PRECINCT_DATA }
}
export const recieveSelectedPrecinctData = election => {
  return {
    type: RECIEVE_SELECTED_PRECINCT_DATA,
    election
  }
}
export const setSelectedPrecinct = precinct => {
  return {
    type: SET_SELECTED_PRECINCT,
    precinct
  }
}

// Asynchronous actions
export const fetchPrecinctData = (id, election, precincts) => {
  return async dispatch => {
    const selectedPrecinct = precincts.find(p => p.id === id)
    dispatch(fetchSelectedPrecinctData())
    dispatch(setSelectedPrecinct(selectedPrecinct))
    const { data } = await axios.get(process.env.REACT_APP_API_URL + `/api/precinct/${id}/${election}`);
    // if (!data)
    //   return;
    if (data)
      data.results.sort((a, b) => b.votes - a.votes);
    dispatch(recieveSelectedPrecinctData(data));
  }
}
export const fetchPrecinctsByState = (abbr) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(process.env.REACT_APP_API_URL + `/api/precinct/state/${abbr}`);
      if (!data)
        return;
      let features = [];
      for (let precinct of data) {
        features = features.concat(JSON.parse(precinct.geojson));
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