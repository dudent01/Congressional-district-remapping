import React from "react";
import { Map, GeoJSON, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw"
import { Form, Button } from "react-bootstrap"
import { defaultMapCenter, defaultMapZoom, stateColor, precinctColor } from "../config"
import { connect } from 'react-redux';
import hash from 'object-hash';

import { selectState, fetchPrecinctsByState, fetchAllStates, deleteAllPrecincts, deselectState } from '../actions';
// Use hash for fixing rerendering bug in GeoJSON tag 
// TODO: replace hashing object for key with something else because of slow performance 

const mapStateToProps = s => {
	return {
		statesGeojson: s.states.geojson,
		states: s.states.states,
		selectedState: s.states.selectedState,
		precinctsGeojson: s.precincts.geojson,
		precincts: s.precincts.precincts
	}
}
const mapDispatchToProps = dispatch => {
	return {
		onSelectState: abbr => {
			dispatch(selectState(abbr));
			dispatch(fetchPrecinctsByState(abbr));
		},
		removePrecincts: () => {
			dispatch(deleteAllPrecincts())
			dispatch(deselectState(""))
		}
	};
};

class StateMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			center: defaultMapCenter,
			zoom: defaultMapZoom,
			geojson: props.statesGeojson,
			viewport: {}
		}
	}
	componentWillReceiveProps(nextProps) {  // whenever precincts geojson or states geojson is loaded, update the map
		if (nextProps.statesGeojson) {
			this.setState({ geojson: nextProps.statesGeojson });
		}
		if (nextProps.precincts) {
			this.setState({ geojson: nextProps.precinctsGeojson });
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
		this.setState({	center, zoom })
	}
	resetClicked() {
		this.props.removePrecincts() // remove precincts to reset map
		this.setState({
			center: defaultMapCenter,
			zoom: defaultMapZoom,
			viewport: {} // reset the viewport to center in on USA
		})
	}
	onEachStateFeature(feature, layer) {
		layer.on({
			// mouseover: this.highlightFeature.bind(this),
			// mouseout: this.resetHighlight.bind(this),
			click: e => {
				let layer = e.target;
				let abbr = layer.feature.properties.ABBR;
				let center = layer.feature.properties.CENTER;
				let zoom = layer.feature.properties.ZOOM;
		
				this.props.onSelectState(abbr);
				this.setState({
					center, zoom
				})
			}
		});
	}
	onEachPrecinctFeature(feature, layer) {
		layer.on({
			// mouseover: this.highlightFeature.bind(this),
			// mouseout: this.resetHighlight.bind(this),
			click: e => {
				let layer = e.target;
				let id = layer.feature.properties.id;
				alert(id)
			}
		});
	}
	render() {
		const stateSelectOptions = this.props.states.map(state => <option key={state.id} value={state.abbr}>{state.name}</option>);
		const statesGeojson = this.props.precincts.length === 0 ? // check if there are precincts available, if not show states
			<GeoJSON
				key={hash(this.props.states)}
				data={this.props.statesGeojson}
				// style={this.checkIfError.bind(this)} 
				onEachFeature={this.onEachStateFeature.bind(this)}
				style={{ color: stateColor }}
			>
			</GeoJSON> : null
		return (
			<Map
				id="leaflet-map"
				center={this.state.center}
				zoom={this.state.zoom} ref="map"
				viewport={this.state.viewport}
			>
				<div id="map-controls" className="leaflet-right leaflet-top" style={{ "pointerEvents": "auto" }}>
					<Form inline className="m-2">
						<Form.Control as="select" placeholder="Select one" className="mr-2"
							value={this.props.selectedState}
							onChange={(e) => this.handleSelectState(e.target.value)}
						>
							<option value="" disabled>Select State</option>
							{stateSelectOptions}
						</Form.Control>
						<Form.Control as="select" className="mr-2"
							// onChange={this.changeOfElection.bind(this)} 
							value={this.state.electionValue}>
							<option value="" disabled>Select Election</option>
							<option value="presidential2016">
								2016 Presidential</option>
							<option value="congressional2016">
								2016 Congressional</option>
							<option value="congressional2018">
								2018 Congressional</option>
						</Form.Control>
						<Button className="ml-auto"
							onClick={this.resetClicked.bind(this)}
						>Reset</Button>
					</Form>
				</div>
				<FeatureGroup>
					<EditControl
						position='topleft'
						onEdited={this._onEditPath}
						onCreated={this._onCreate}
						onDeleted={this._onDeleted}
						draw={{
							rectangle: false,
							circle: false,
							circlemarker: false
						}}
					/>
				</FeatureGroup>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				{statesGeojson}
				<GeoJSON
					key={hash(this.props.precincts[0] || {})}
					data={this.props.precinctsGeojson}
					style={{ color: precinctColor }}
					onEachFeature={this.onEachPrecinctFeature.bind(this)}
				/>
			</Map>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(StateMap);