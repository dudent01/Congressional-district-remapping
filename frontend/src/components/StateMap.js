import hash from 'object-hash';
import React from "react";
import { Map, GeoJSON, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw"
import { Form, Button } from "react-bootstrap"
import { defaultMapCenter, defaultMapZoom, defaultElection, stateColor, precinctColor, leafletDrawOptions } from "../config"
import { connect } from 'react-redux';
import { selectState, deselectState } from '../actions/stateActions';
import { fetchPrecinctsByState, deletePrecincts, fetchPrecinctData, updatePrecinctGeojson } from '../actions/precinctActions';
// TODO: replace hashing object for key with something else because of slow performance 

const mapStateToProps = s => {
	return {
		statesGeojson: s.states.geojson,
		states: s.states.states,
		selectedState: s.states.selectedState,

		precinctsGeojson: s.precincts.geojson,
		precinctGeojsonKey: s.precincts.geojsonKey,
		precincts: s.precincts.precincts,
		selectedPrecinct: s.precincts.selectedPrecinct,
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
		updatePrecinctGeojson: async (id, geojson) => {
			await dispatch(updatePrecinctGeojson(id, geojson))
		}
	};
};

class StateMap extends React.Component {
	constructor(props) {
		super(props);
		this.geojson = React.createRef();
		this.edit = React.createRef();
		this.map = React.createRef();
		this.state = {
			center: defaultMapCenter,
			zoom: defaultMapZoom,
			viewport: {},
			election: defaultElection,
			isStateSelected: false,
			isPrecinctSelected: false,
		}
	}
	handleSelectState(abbr) {
		this.props.onSelectState(abbr);
		let state;
		for (let s of this.props.states) {
			if (s.abbr === abbr)
				state = s;
		}
		let center = state.geojson.properties.CENTER;
		let zoom = state.geojson.properties.ZOOM;
		this.setState({ center, zoom, isStateSelected: true })
	}
	handleResetClicked() {
		this.props.removePrecincts() // remove precincts to reset map
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
				this.setState({
					center, zoom, isStateSelected: true
				})
			}
		});
	}
	onEachPrecinctFeature(feature, layer) {
		layer.on({
			click: e => {
				let layer = e.target;
				let id = layer.feature.properties.id;
				this.props.onSelectPrecinct(id, this.state.election, this.props.precincts)
			}
		});
	}
	_onCreate(e) {
		if (e.layerType !== 'polygon') return;
		if (!this.props.selectedPrecinct) return;

		let id = this.props.selectedPrecinct.id
		let geojson = e.layer.toGeoJSON()
		if (window.confirm(`Would you like to set the boundary data for Precinct ${id}?`))
			this.props.updatePrecinctGeojson(id, geojson).then(() => this.map.current.contextValue.map.removeLayer(e.layer))
		else
			this.map.current.contextValue.map.removeLayer(e.layer)
	}
	checkBoxChange(e) {
		if (e.target.id === "nationalParks") {
			if (e.target.checked === false) {
				console.log("National Parks Disabled");
			} else {
				console.log("National Parks Enabled");
			}
		} else if (e.target.id === "districtBounds") {
			if (e.target.checked === false) {
				console.log("Congressional Bounds Disabled");
			} else {
				console.log("Congressional Bounds Enabled");
			}
		}
	}
	render() {
		const stateSelectOptions = this.props.states.map(state => <option key={state.id} value={state.abbr}>{state.name}</option>);
		let geojson;
		// render either the states geojson or precincts geojson based on if there are precincts loaded
		if (this.props.precincts.length === 0)
			geojson = <GeoJSON key={hash(this.props.states)} data={this.props.statesGeojson}
				onEachFeature={this.onEachStateFeature.bind(this)} style={{ color: stateColor }} />
		else
			geojson = <GeoJSON key={this.props.precinctGeojsonKey} data={this.props.precinctsGeojson}
				onEachFeature={this.onEachPrecinctFeature.bind(this)} style={{ color: precinctColor }} />

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
					</Form>
					<Form inline className="m-2">
						<Form.Group className="mr-2" controlId="nationalParks">
							<Form.Check type="checkbox" id="nationalParks" disabled={!this.state.isStateSelected} onClick={this.checkBoxChange} label="Toggle National Parks" />
						</Form.Group>
						<Form.Group controlId="districtBounds">
							<Form.Check type="checkbox" id="districtBounds" disabled={!this.state.isStateSelected} onClick={this.checkBoxChange} label="Toggle District Boundaries" />
						</Form.Group></Form>
				</div>
				<FeatureGroup>
					<EditControl
						ref={this.edit}
						position='topleft'
						onEdited={this._onEditPath}
						onCreated={this._onCreate.bind(this)}
						onDeleted={this._onDeleted}
						draw={leafletDrawOptions}
					/>
				</FeatureGroup>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				{geojson}
			</Map>
		)
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(StateMap);