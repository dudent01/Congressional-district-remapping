import {
  DELETE_PRECINCTS, REQUEST_PRECINCTS, RECEIVE_PRECINCTS, REQUEST_SELECTED_PRECINCT_DATA, RECIEVE_SELECTED_PRECINCT_DATA,
  SET_SELECTED_PRECINCT, SET_SECOND_SELECTED_PRECINCT,
  ADD_NEIGHBOR, DELETE_NEIGHBOR, MERGE_PRECINCTS, UPDATE_GEOJSON_KEY, UPDATE_PRECINCT, UPDATE_ELECTION
} from './types';
import axios from 'axios';

// Synchronous actions
export const updateGeojsonKey = () => {
  return {
    type: UPDATE_GEOJSON_KEY
  }
}
export const deletePrecincts = () => ({ type: DELETE_PRECINCTS })
export const requestPrecincts = () => ({ type: REQUEST_PRECINCTS })
export const requestSelectedPrecinctData = () => ({ type: REQUEST_SELECTED_PRECINCT_DATA })
export const recieveSelectedPrecinctData = (election, neighbors) => ({ type: RECIEVE_SELECTED_PRECINCT_DATA, election, neighbors })
export const setSelectedPrecinct = precinct => {
  return {
    type: SET_SELECTED_PRECINCT,
    precinct
  }
}
export const setSecondSelectedPrecinct = precinct => {
  return {
    type: SET_SECOND_SELECTED_PRECINCT,
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
export const addNeighbor = (neighborId) => {
  return { type: ADD_NEIGHBOR, neighborId }
}
export const deleteNeighbor = (neighborId) => {
  return { type: DELETE_NEIGHBOR, neighborId }
}
export const mergePrecincts = (id1, id2, precinct) => {
  return { type: MERGE_PRECINCTS, id1, id2, precinct }
}
export const updatePrecinct = (data) => {
  return { type: UPDATE_PRECINCT, data }
}
export const updateElection = (election) => {
  return { type: UPDATE_ELECTION, election}
}

// Asynchronous actions
export const fetchPrecinctData = (id, election, precincts) => {
  return async (dispatch) => {
    const selectedPrecinct = precincts.find(p => p.id === id)
    dispatch(setSelectedPrecinct(selectedPrecinct))
    dispatch(requestSelectedPrecinctData())
    let values = await Promise.all([
      axios.get(process.env.REACT_APP_API_URL + `/api/precinct/${id}/${election}`),
      axios.get(process.env.REACT_APP_API_URL + `/api/precinct/${id}/neighbors`)
    ])
    let data = values[0].data[0];
    let neighbors = values[1].data;
    dispatch(recieveSelectedPrecinctData(data, neighbors));
  }
}
export const fetchPrecinctsByState = (abbr) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(process.env.REACT_APP_API_URL + `/api/precinct/state/${abbr}`);
      let features = [];
      for (let precinct of data) {
        if (!precinct.geojson) {
          continue;
        }
        try {
          precinct.geojson = JSON.parse(precinct.geojson)
        } catch {
          continue;
        }
        if (!precinct.geojson.properties) continue;
        precinct.geojson.properties.id = precinct.id  // Set id in geojson for use in the Leaflet API onClick handler
        precinct.geojson.properties.name = precinct.name
        features = features.concat(precinct.geojson);
        delete precinct.geojson;
      }
      let geojson = { type: "FeatureCollection", features };
      dispatch(recievePrecincts(data, geojson));
    } catch (error) {
      throw (error);
    }
  }
}
export const updatePrecinctGeojson = (id, geojson) => {
  return async (dispatch) => {
    await axios.put(process.env.REACT_APP_API_URL + `/api/precinct/${id}/geojson`, geojson)
    // dispatch({ type: SET_PRECINCT_GEOJSON, geojson, id })
  }
}
export const addNeighborAsync = (id, neighborId) => {
  return async (dispatch) => {
    await axios.patch(process.env.REACT_APP_API_URL + `/api/precinct/${id}/${neighborId}`)
    dispatch(addNeighbor(neighborId))
  }
}
export const deleteNeighborAsync = (id, neighborId) => {
  return async (dispatch) => {
    await axios.delete(process.env.REACT_APP_API_URL + `/api/precinct/${id}/${neighborId}`)
    dispatch(deleteNeighbor(neighborId))
  }
}
export const mergePrecinctsAsync = (id1, id2) => {
  return async (dispatch) => {
    let { data } = await axios.patch(process.env.REACT_APP_API_URL + `/api/precinct/${id1}/${id2}/merge`)
    dispatch(mergePrecincts(id1, id2, data))
  }
}