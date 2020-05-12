import { SET_DRAW_POLYGON, ENABLE_DRAW_POLYGON } from "../actions/types"

const initialState = {
  drawPolygon: null
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
    default:
      return state
  }
}
