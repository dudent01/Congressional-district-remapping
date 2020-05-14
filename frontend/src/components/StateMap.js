import hash from 'object-hash';
import React from "react";
import { Map, GeoJSON, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw"
import { Form, Button } from "react-bootstrap"
import {
	defaultMapCenter, defaultMapZoom, defaultElection, stateColor, precinctStyle, leafletDrawOptions, leafletEditOptions,
	selectedPrecinctStyle, nationalParkStyle, neighborPrecinctStyle, secondSelectedPrecinctStyle
} from "../config"
import { connect } from 'react-redux';
import { selectState, deselectState } from '../actions/stateActions';
import {
	fetchPrecinctsByState, deletePrecincts, fetchPrecinctData, updatePrecinctGeojson,
	addNeighborAsync, deleteNeighborAsync, mergePrecinctsAsync, setSecondSelectedPrecinct, updateGeojsonKey, generatePrecinctAsync
} from '../actions/precinctActions';
import { setDrawPolygon, unsetTool } from '../actions/mapActions'
import { ADD_NEIGHBOR, DELETE_NEIGHBOR, MERGE_PRECINCTS } from '../actions/types'
import L from 'leaflet'
import nationalParksGeojson from '../assets/simplified_national_parks.json'

const mapStateToProps = s => {
	return {
		statesGeojson: s.states.geojson,
		states: s.states.states,
		selectedState: s.states.selectedState,

		precinctsGeojson: s.precincts.geojson,
		precinctGeojsonKey: s.precincts.geojsonKey,
		precincts: s.precincts.precincts,
		selectedPrecinct: s.precincts.selectedPrecinct,
		secondSelectedPrecinct: s.precincts.secondSelectedPrecinct,

		drawPolygon: s.map.drawPolygon,
		toolAction: s.map.toolAction
	}
}
const mapDispatchToProps = dispatch => {
	return {
		onSelectState: abbr => {
			dispatch(deletePrecincts());
			dispatch(selectState(abbr));
			dispatch(fetchPrecinctsByState(abbr));
		},
		removePrecincts: () => {
			dispatch(deletePrecincts())
			dispatch(deselectState(""))
		},
		onSelectPrecinct: (id, election, precincts) => {
			dispatch(fetchPrecinctData(id, election, precincts))
		},
		setDrawPolygon: (drawPolygon) => {
			dispatch(setDrawPolygon(drawPolygon))
		},
		updatePrecinctGeojson: async (id, geojson) => {
			await dispatch(updatePrecinctGeojson(id, geojson))
		},
		addNeighbor: async (id, neighborId) => {
			await dispatch(addNeighborAsync(id, neighborId))
			dispatch(unsetTool())
			dispatch(setSecondSelectedPrecinct(null))
		},
		deleteNeighbor: async (id, neighborId) => {
			await dispatch(deleteNeighborAsync(id, neighborId))
			dispatch(unsetTool())
			dispatch(setSecondSelectedPrecinct(null))
		},
		mergePrecincts: async (id1, id2) => {
			await dispatch(mergePrecinctsAsync(id1, id2))
			dispatch(unsetTool())
			dispatch(setSecondSelectedPrecinct(null))
		},
		unsetTool: () => {
			dispatch(unsetTool())
			dispatch(setSecondSelectedPrecinct(null))
		},
		setSecondSelectedPrecinct: (precinct) => {
			dispatch(setSecondSelectedPrecinct(precinct))
		},
		updateGeojsonKey: () => {
			dispatch(updateGeojsonKey())
		},
		addPrecinct: async (geojson, state) => {
			await dispatch(generatePrecinctAsync(geojson, state))
		}
	};
};

class StateMap extends React.Component {
	constructor(props) {
		super(props);
		this.edit = React.createRef();
		this.map = React.createRef();
		this.state = {
			center: defaultMapCenter,
			zoom: defaultMapZoom,
			viewport: {},
			election: defaultElection,
			isStateSelected: false,
			isPrecinctSelected: false,
			showNationalParks: false
		}
	}
	componentDidMount() {
		this.props.setDrawPolygon(new L.Draw.Polygon(this.map.current.leafletElement, leafletDrawOptions.polygon))
	}
	handleSelectState(abbr) {
		this.props.onSelectState(abbr);
		let state;
		for (let s of this.props.states) {
			if (s.abbr === abbr) {
				state = s;
				break;
			}
		}
		let center = state.geojson.properties.CENTER;
		let zoom = state.geojson.properties.ZOOM;
		this.setState({ center, zoom, isStateSelected: true })
		this.resetFeaturedGroup()
	}
	handleResetClicked() {
		this.props.removePrecincts() // remove precincts to reset map
		this.resetFeaturedGroup()
		this.setState({
			center: defaultMapCenter,
			zoom: defaultMapZoom,
			isStateSelected: false,
			isPrecinctSelected: false,
			viewport: {} // reset the viewport to center in on USA
		})
	}
	onEachStateFeature(feature, layer) {
		layer.on({
			click: e => {
				let layer = e.target;
				let abbr = layer.feature.properties.abbr;
				let center = layer.feature.properties.CENTER;
				let zoom = layer.feature.properties.ZOOM;
				this.props.onSelectState(abbr);
				this.setState({ center, zoom, isStateSelected: true })
			}
		});
	}
	resetFeaturedGroup() {  // Fix an error where when editing there are still editing layers showing
		let layerContainer = this.refs.featuredGroup.contextValue.layerContainer
		layerContainer.eachLayer(layer => {
			layerContainer.removeLayer(layer)
			layer.addTo(this.map.current.contextValue.map)
		})
	}
	onEachPrecinctFeature(feature, layer) {
		layer.on({
			click: e => {
				let layer = e.target;
				let { name, id } = layer.feature.properties;
				console.log(id)
				if (this.props.selectedPrecinct && this.props.selectedPrecinct.id === id) return;
				if (this.props.toolAction) {
					this.props.setSecondSelectedPrecinct(this.props.precincts.find(p => p.id === id))
					window.setTimeout(() => { // set timeout of 0 to add to end of event queue
						switch (this.props.toolAction) {
							case ADD_NEIGHBOR:
								if (window.confirm(`Are you sure you want to add Precinct ${name} to neighbors?`)) {
									this.props.addNeighbor(this.props.selectedPrecinct.id, id)
								} else {
									this.props.unsetTool()
								}
								break;
							case DELETE_NEIGHBOR:
								if (window.confirm(`Are you sure you want to delete Precinct ${name} from neighbors?`)) {
									this.props.deleteNeighbor(this.props.selectedPrecinct.id, id)
								} else {
									this.props.unsetTool()
								}
								break;
							case MERGE_PRECINCTS:
								if (window.confirm(`Are you sure you want to merge Precinct ${name}?`)) {
									this.resetFeaturedGroup()
									this.props.mergePrecincts(this.props.selectedPrecinct.id, id)
								} else {
									this.props.unsetTool()
								}
								break;
							default:
						}
					}, 0)

				} else {
					this.resetFeaturedGroup()
					if (layer.feature.geometry.type === 'Polygon') { // Only enable editing for Polygons
						this.refs.featuredGroup.contextValue.layerContainer.addLayer(layer)
					}
					this.props.onSelectPrecinct(id, this.state.election, this.props.precincts)
				}
			}
		});
	}
	handleCheckBoxChange(e) {
		this.setState({ showNationalParks: e.target.checked })
	}
	handleLeafletEdit(e) {
		if (!this.props.selectedPrecinct) {
			return;
		}
		e.layers.eachLayer(layer => {
			let geojson = layer.toGeoJSON();
			let { id, name } = geojson.properties;
			if (!id) {
				return;
			}
			geojson.properties = {}
			if (window.confirm(`Would you like to set this as the official boundary data for Precinct ${name}?`)) {
				this.props.updatePrecinctGeojson(id, geojson).then(() => this.resetFeaturedGroup())
			}
		})
	}
	handleLeafletCreate(e) {
		if (e.layerType !== 'polygon' || !this.props.precincts) {
			return;
		}
		let geojson = e.layer.toGeoJSON();
		window.setTimeout(() => {
			if (window.confirm(`Would you like to create a new Precinct from this boundary in State ${this.props.selectedState}?`)) {
				this.props.addPrecinct(geojson, this.props.selectedState).then(() => {
					this.refs.featuredGroup.contextValue.layerContainer.removeLayer(e.layer)
				})
			} else {
				this.refs.featuredGroup.contextValue.layerContainer.removeLayer(e.layer)
			}
		}, 0)
	}
	precinctStyle = (feature) => {
		if (this.props.secondSelectedPrecinct && this.props.secondSelectedPrecinct.id === feature.properties.id) {
			return secondSelectedPrecinctStyle;
		}
		if (this.props.selectedPrecinct) {
			if (this.props.selectedPrecinct.id === feature.properties.id) {
				return selectedPrecinctStyle;
			} else if (this.props.selectedPrecinct.neighbors && this.props.selectedPrecinct.neighbors.includes(feature.properties.id)) {
				return neighborPrecinctStyle;
			}
		}
		return precinctStyle;
	}
	render() {
		const stateSelectOptions = this.props.states.map(state => <option key={state.id} value={state.abbr}>{state.name}</option>);
		let geojson;
		// render either the states geojson or precincts geojson based on if there are precincts loaded
		if (this.props.precincts.length === 0) {
			geojson = <GeoJSON key={hash(this.props.states)} data={this.props.statesGeojson}
				onEachFeature={this.onEachStateFeature.bind(this)} style={{ color: stateColor }} />
		} else {
			geojson = <GeoJSON key={this.props.precinctGeojsonKey} data={this.props.precinctsGeojson}
				onEachFeature={this.onEachPrecinctFeature.bind(this)} style={this.precinctStyle} />
		}
		return (
			<Map id="leaflet-map" center={this.state.center} zoom={this.state.zoom} viewport={this.state.viewport} ref={this.map}>
				<div id="map-controls" className="leaflet-right leaflet-top" style={{ "pointerEvents": "auto" }}>
					<Form inline className="m-2">
						<Form.Control as="select" placeholder="Select one" className="mr-2" value={this.props.selectedState}
							onChange={(e) => this.handleSelectState(e.target.value)}
						>
							<option value="" disabled>Select State</option>
							{stateSelectOptions}
						</Form.Control>
						<Form.Control as="select" className="mr-2"
							onChange={e => this.setState({ election: e.target.value })}
							value={this.state.election}
						>
							<option value="" disabled>Select Election</option>
							<option value="presidential2016">2016 Presidential</option>
							<option value="congressional2016">2016 Congressional</option>
							<option value="congressional2018">2018 Congressional</option>
						</Form.Control>
						<Button className="ml-auto" onClick={this.handleResetClicked.bind(this)}>Reset</Button>
						<Button onClick={() => this.props.updateGeojsonKey()}>Update map</Button>
					</Form>
					<Form inline className="m-2">
						<Form.Group className="mr-2" controlId="nationalParks">
							<Form.Check type="checkbox" id="nationalParks" onClick={(e) => this.handleCheckBoxChange(e)} checked={this.state.showNationalParks} style={{ fontSize: "15px" }} label="Toggle National Parks" />
						</Form.Group>
						<Form.Group controlId="districtBounds">
							<Form.Check type="checkbox" id="districtBounds" disabled={true} style={{ fontSize: "15px" }} onClick={() => { }} label="Toggle District Boundaries" />
						</Form.Group></Form>
				</div>
				<FeatureGroup ref="featuredGroup">
					<EditControl
						ref={this.edit}
						position='topleft'
						onEdited={this.handleLeafletEdit.bind(this)}
						onCreated={this.handleLeafletCreate.bind(this)}
						draw={leafletDrawOptions}
						edit={leafletEditOptions}
					/>
				</FeatureGroup>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				{geojson}
				{this.state.showNationalParks &&
					<GeoJSON data={nationalParksGeojson} style={nationalParkStyle} />
				}
			</Map>
		)
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(StateMap);