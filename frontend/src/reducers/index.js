import { combineReducers } from 'redux';
import states from './stateReducer';
import precincts from './precinctReducer';
import map from './mapReducer'

export default combineReducers({ states, precincts, map });