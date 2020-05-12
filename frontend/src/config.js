export const defaultMapCenter = [39.8283, -98.5795];
export const defaultMapZoom = 4;
export const defaultElection = "presidential2016"
export const stateColor = "darkorange";
export const precinctColor = "blue";
export const selectedPrecinctColor = "yellow"
export const neighborPrecinctColor = "purple"
export const nationalParkColor = "green"
export const leafletDrawOptions = {
  polygon: {
    shapeOptions: {
      color: '#f357a1',
      weight: 5
    },
    allowIntersection: false, // Restricts shapes to simple polygons
    drawError: {
      color: '#e1e100', // Color the shape will turn when intersects
      message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
    },
  },
  circle: false,
  circlemarker: false,
  rectangle: false,
  polyline: false,
  marker: false
}
