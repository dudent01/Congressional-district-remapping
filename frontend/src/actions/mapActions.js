import { SET_DRAW_POLYGON, ENABLE_DRAW_POLYGON } from "./types"

export const setDrawPolygon = (drawPolygon) => ({
  type: SET_DRAW_POLYGON,
  drawPolygon
})
export const enableDrawPolygon = () => ({
  type: ENABLE_DRAW_POLYGON
})