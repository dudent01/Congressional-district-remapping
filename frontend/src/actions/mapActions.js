import {
  SET_DRAW_POLYGON, ENABLE_DRAW_POLYGON, SET_TOOL_ADD_NEIGHBOR,
  SET_TOOL_MERGE_PRECINCTS, SET_TOOL_DELETE_NEIGHBOR, SET_TOOL_DRAW_NEW_BOUNDARY, UNSET_TOOL, SET_MAP, SET_ELECTION_TYPE
} from "./types"

export const setDrawPolygon = (drawPolygon) => ({
  type: SET_DRAW_POLYGON,
  drawPolygon
})
export const setMap = (map) => ({ type: SET_MAP, map })
export const enableDrawPolygon = () => ({ type: ENABLE_DRAW_POLYGON })
export const setToolAddNeighbor = () => ({ type: SET_TOOL_ADD_NEIGHBOR })
export const setToolDeleteNeighbor = () => ({ type: SET_TOOL_DELETE_NEIGHBOR })
export const setToolMergePrecincts = () => ({ type: SET_TOOL_MERGE_PRECINCTS })
export const setToolDrawNewBoundary = () => ({ type: SET_TOOL_DRAW_NEW_BOUNDARY })
export const unsetTool = () => ({ type: UNSET_TOOL })
export const setElectionType = (electionType) => ({ type: SET_ELECTION_TYPE, electionType })