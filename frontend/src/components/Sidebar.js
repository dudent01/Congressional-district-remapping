import React from "react";
import { Button, Tabs, Tab, Table, ListGroup, Badge } from "react-bootstrap"
import L from "leaflet"
import { connect } from 'react-redux';

const mapStateToProps = s => {
	return {
		selectedPrecinct: s.precincts.selectedPrecinct
	}
}

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// precinctInfo: {
			// 	name: "N/A",
			// 	population: "N/A",
			// 	winner: "N/A",
			// 	whitePop: "N/A"
			// },
			errorsCount: 0
		}
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
		let election = null;
		if (this.props.selectedPrecinct && this.props.selectedPrecinct.election) {
			election = <tr>
				<th>Name</th>
				<th>Party</th>
				<th>Votes</th>
			</tr>

			election = <>
				<tr>
					<td></td>
				</tr>
				{election}
				{this.props.selectedPrecinct.election.results.map((candidate, index) => {
					return (
						<tr>
							<td>{candidate.name}</td>
							<td>{candidate.party}</td>
							<td>{candidate.votes}</td>
						</tr>
					)
				})}
			</>
		}
		return (
			<Tabs id="sidebar" activeKey={this.state.key} onSelect={key => this.setState({ key })} transition={false} className="mb-2">
				<Tab eventKey="info" title="Information" >
					<Table striped hover>
						{
							this.props.selectedPrecinct ?
								<tbody>
									<tr>
										<td><strong>Precinct Name:</strong></td>
										<td>{this.props.selectedPrecinct.name}</td>
									</tr>
									{election}
								</tbody>
								:
								null
						}
					</Table>
				</Tab>
				<Tab eventKey="err" title={<div>Errors <Badge variant="danger">{this.state.errorsCount}</Badge></div>}>
					<div>
						<ListGroup>
							{this.state.precinctErrors}
						</ListGroup>
					</div>
				</Tab>
				<Tab eventKey="edit" title="Tools">
					<div className="mb-4">
						<h2>Map Control Tools</h2>
						<div className="custom-control custom-checkbox">
							<input type="checkbox" className="custom-control-input" onChange={this.checkBoxChange} defaultChecked={false} id="nationalParks"></input>
							<label className="custom-control-label" htmlFor="nationalParks">Enable/Disable National Parks</label>
						</div>
						<div className="custom-control custom-checkbox">
							<input type="checkbox" className="custom-control-input" onChange={this.checkBoxChange} defaultChecked={false} id="districtBounds"></input>
							<label className="custom-control-label" htmlFor="districtBounds">Enable/Disable District Boundaries</label>
						</div><h2>Data Correction Tools</h2>
						<Button block className="text-left" onClick={e => new L.Draw.Polyline(this.refs.map.leafletElement).enable()}>Add Edge</Button> Add an edge between two precincts.
                </div>
					<div className="mb-4">
						<Button block className="text-left">Combine Precinct</Button> Combine two existing precincts into one.
					</div>
					<div className="mb-4">
						<Button block className="text-left" onClick={e => new L.Draw.Polygon(this.refs.map.leafletElement).enable()}>Generate Ghost Precinct</Button> Create a ghost precinct in case an area where the geographic union of precincts does not fully cover the area of the state
					</div>
				</Tab>
			</Tabs>
		)
	}
}
export default connect(mapStateToProps, null)(Sidebar);