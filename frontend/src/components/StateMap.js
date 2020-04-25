import React from "react";
import { Map, GeoJSON, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw"
import { Form, Button } from "react-bootstrap"
import { defaultMapCenter, defaultMapZoom, stateColor } from "../config"
import { connect } from 'react-redux';
import hash from 'object-hash';

import { selectState } from '../actions';
// Use hash for fixing rerendering bug in GeoJSON tag 

const mapStateToProps = s => {
	return {
		geojson: s.states.geojson,
		states: s.states.states,
		selectedState: s.states.selectedState
	}
}
const mapDispatchToProps = dispatch => {
	return {
		onSelectState: abbr => {
			dispatch(selectState(abbr));
		}
	};
};

class StateMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			center: defaultMapCenter,
			zoom: defaultMapZoom,
			geojson: props.geojson,
			viewport: {}
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.states) {
			this.setState({ geojson: nextProps.geojson });
		}
	}

	resetClicked() {
		// reset the viewport to center in on USA
		this.setState({
			center: defaultMapCenter,
			zoom: defaultMapZoom,
			viewport: {}
		})
	}
	onEachFeature(feature, layer) {
		layer.on({
			// mouseover: this.highlightFeature.bind(this),
			// mouseout: this.resetHighlight.bind(this),
			click: this.clickToFeature.bind(this)
		});
	}
	clickToFeature(e) {
		let layer = e.target;
		let abbr = layer.feature.properties.ABBR;
		this.props.onSelectState(abbr);
		// if (name === undefined) {
		//   let precinct = {NAME: "Default"}
		//   let info = {population: 800, votes: {winner: "John Doe", party: "OTHER", votes: 421}, demo: {white: 400, black: 200, asian: 50, hispanic: 100, other: 50}}
		//   this.createInformation(precinct, info);
		//   this.highlightNeighbors();
		// } else{
		//   this.setCenter(name);
		//   this.setState({isLoading: true})
		//   axios.get("http://localhost:8080/api/precinct/state/" + layer.feature.properties.ABBR).then((response) => {
		//     response.data.forEach(state => state.geojson = JSON.parse(state.geojson))
		//     var x = {type: "FeatureCollection", features: response.data.map(state => state.geojson)};
		//     this.setState({ geoJson: x, isLoading: false});
		//   });
		// }
		// console.log(this.refs)
		// this.setState({ key: "info" })
		// Assumming you have a Leaflet map accessible
	}
	render() {
		const stateSelectOptions = this.props.states.map(state => <option value={state.abbr}>{state.name}</option>);

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
							onChange={(e) => this.props.onSelectState(e.target.value)}
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
				<GeoJSON
					key={hash(this.props.states)}
					data={this.state.geojson}
					// style={this.checkIfError.bind(this)} 
					onEachFeature={this.onEachFeature.bind(this)}
					style={{ color: stateColor }}
				>
				</GeoJSON>
			</Map>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(StateMap);