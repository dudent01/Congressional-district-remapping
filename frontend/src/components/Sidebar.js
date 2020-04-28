import React from "react";
import { Button, Tabs, Tab, Table, ListGroup, Badge, Spinner } from "react-bootstrap"
import L from "leaflet"
import { connect } from 'react-redux';

const mapStateToProps = s => {
	return {
		selectedPrecinct: s.precincts.selectedPrecinct,
		isFetchingSelectedPrecinct: s.precincts.isFetchingSelectedPrecinct,
		selectedState:s.states.selectedState
	}
}

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errorsCount: 0
		}
	}


	render() {
		let election = null;
		console.log(this.props.selectedPrecinct)
		if (this.props.selectedPrecinct) {
			if (this.props.selectedPrecinct.election) {
				election = <tr>
					<th>Name</th>
					<th>Politcal Party</th>
					<th>Votes</th>
				</tr>

				election = <>
					<b className="text-center">{this.props.selectedPrecinct.election.type.replace("_", " ")}</b>
					<Table hover variant="danger" bordered>
						<tbody>
							{election}
							{this.props.selectedPrecinct.election.results.map((candidate, index) => {
								return (
									<tr key={candidate.party}>
										<td>{candidate.name}</td>
										<td>{candidate.party}</td>
										<td>{candidate.votes}</td>
									</tr>
								)
							})}
						</tbody>
					</Table>
				</>
			}
			else if (this.props.isFetchingSelectedPrecinct) {
				election = <div className="text-center"><Spinner animation="border" /></div>
			}
			else if (!this.props.isFetchingSelectedPrecinct) {
				election = <div>This precinct has no election data.</div>
			}
		}
		return (
			<Tabs id="sidebar" activeKey={this.state.key} onSelect={key => this.setState({ key })} transition={false} className="mb-2">
				<Tab eventKey="info" title="Information" >
					{
						this.props.selectedPrecinct ?
							<Table striped hover>
								<tbody>
									<tr>
										<td><strong>Precinct Name:</strong></td>
										<td>{this.props.selectedPrecinct.name}</td>
									</tr>
								</tbody>
							</Table>
							:
							<span><h2>Welcome to the Precinct Error Correction Program!</h2>To begin, please select a state, then select a precinct whose data you would wish to view. It will then be shown here.</span>
					}
					{election}
				</Tab>
				<Tab eventKey="err" disabled={this.props.selectedState === ""} title={<div>Errors <Badge variant="danger">{this.state.errorsCount}</Badge></div>}>
					<div>
						<ListGroup>
							{this.state.precinctErrors}
						</ListGroup>
					</div>
				</Tab>
				<Tab eventKey="edit" disabled={this.props.selectedPrecinct === null || this.props.selectedState === ""} title="Tools">
					<div className="mb-4">
						<Button block className="text-left" onClick={e => new L.Draw.Polyline(this.refs.map.leafletElement).enable()}>
							Add Edge
						</Button>
						Add an edge between two precincts.
					</div>
					<div className="mb-4">
						<Button block className="text-left">Combine Precinct</Button> Combine two existing precincts into one.
					</div>
					<div className="mb-4">
						<Button block className="text-left" onClick={e => new L.Draw.Polygon(this.refs.map.leafletElement).enable()}>
							Generate Ghost Precinct
						</Button>
						Create a ghost precinct in case an area where the geographic union of precincts does not fully cover the area of the state
					</div>
				</Tab>
			</Tabs>
		)
	}
}
export default connect(mapStateToProps, null)(Sidebar);