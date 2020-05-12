import { SET_DRAW_POLYGON, ENABLE_DRAW_POLYGON, ADD_NEIGHBOR, MERGE_PRECINCTS, 
  DELETE_NEIGHBOR, SET_TOOL_ADD_NEIGHBOR, SET_TOOL_DELETE_NEIGHBOR, SET_TOOL_MERGE_PRECINCTS, UNSET_TOOL } from "../actions/types"

const initialState = {
  drawPolygon: null,
  toolAction: null // ADD_NEIGHBOR, DELETE_NEIGHBOR, MERGE_PRECINCTS, NULL. Used for deciding what happens when selecting on precinct
}

export default function mapReducer(state = initialState, action) {
  switch(action.type) {
    case SET_DRAW_POLYGON:
      return {
        ...state,
        drawPolygon: action.drawPolygon
      }
    case ENABLE_DRAW_POLYGON:
      if (state.drawPolygon) {
        state.drawPolygon.enable()
      }
      return state
    case SET_TOOL_ADD_NEIGHBOR:
      return {
        ...state,
        toolAction: ADD_NEIGHBOR
      }
    case SET_TOOL_MERGE_PRECINCTS:
      return {
        ...state,
        toolAction: MERGE_PRECINCTS
      }
    case SET_TOOL_DELETE_NEIGHBOR:
      return {
        ...state,
        toolAction: DELETE_NEIGHBOR
      }
    case UNSET_TOOL: {
      return {
        ...state,
        toolAction: null
      }
    }
    default:
      return state
  }
}
