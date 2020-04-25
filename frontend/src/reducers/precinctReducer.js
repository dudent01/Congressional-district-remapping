import { FETCH_PRECINCT, MERGE_PRECINCT, UPDATE_PRECINCT, CREATE_GHOST_PRECINCT } from '../actions/types';

export default function precinctReducer(state = [], action) {
  switch (action.type) {
    // case ADD_POST:
    //   return [...state, action.payload];
    // case DELETE_POST:
    //   return state.filter(post => post._id !== action.payload.id);
    case FETCH_PRECINCT:
      return action.posts;
    default:
      return state;
  }
}