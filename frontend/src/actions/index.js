import {
  FETCH_PRECINCT, MERGE_PRECINCT, UPDATE_PRECINCT, CREATE_GHOST_PRECINCT, FETCH_STATE, SET_SELECTED_PRECINCT,
  SELECT_STATE, DELETE_PRECINCT, DESELECT_STATE, FETCH_ELECTION
} from './types';
import axios from 'axios';


export const fetchPrecincts = (precincts, geojson) => {
  return {
    type: FETCH_PRECINCT,
    precincts,
    geojson
  }
}

export const fetchElectionData = election => {
  return {
    type: FETCH_ELECTION,
    election
  }
}

export const setSelectedPrecinct = precinct => {
  return {
    type: SET_SELECTED_PRECINCT,
    precinct
  }
}

export const fetchPrecinctElectionData = (id, election, precincts) => {
  return async dispatch => {
    const selectedPrecinct = precincts.find(p => p.id == id)
    dispatch(setSelectedPrecinct(selectedPrecinct))
    const { data } = await axios.get(process.env.REACT_APP_API_URL + `/api/precinct/${id}/${election}`);
    if (!data)
      return;
    data.results.sort((a, b) => b.votes - a.votes);
    dispatch(fetchElectionData(data));
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
      dispatch(fetchPrecincts(data, geojson));
    }
    catch (error) {
      throw (error);
    }
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
  return async (dispatch) => {
    const { data } = await axios.get(process.env.REACT_APP_API_URL + "/api/state");
    data.forEach(state => state.geojson = JSON.parse(state.geojson));
    let states = {
      geojson: { type: "FeatureCollection", features: data.map(state => state.geojson) },
      states: data
    };
    dispatch(fetchStates(states));
  }
}
