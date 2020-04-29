import { combineReducers } from 'redux';
import states from './StateReducer';
import precincts from './PrecinctReducer';
import map from './MapReducer'

export default combineReducers({
    states,
    precincts,
    map
});