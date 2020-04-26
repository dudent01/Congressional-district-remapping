import { combineReducers } from 'redux';
import states from './stateReducer';
import precincts from './precinctReducer';

export default combineReducers({
    states,
    precincts
});