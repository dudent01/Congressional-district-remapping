import React from "react";
import { Button, Tabs, Tab, Table, ListGroup, Badge, Spinner, Container } from "react-bootstrap"
import { connect } from 'react-redux';
import { enableDrawPolygon } from '../actions/MapActions'

const mapStateToProps = s => {
	return {
		selectedPrecinct: s.precincts.selectedPrecinct,
		isFetchingSelectedPrecinct: s.precincts.isFetchingSelectedPrecinct,
		selectedState: s.states.selectedState,
		states: s.states.states,
	}
}
const mapDispatchToProps = dispatch => {
	return {
		enableDrawPolygon: () => dispatch(enableDrawPolygon())
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
			} else if (this.props.isFetchingSelectedPrecinct) {
				election = <div className="text-center"><Spinner animation="border" /></div>
			} else if (!this.props.isFetchingSelectedPrecinct) {
				election = <div>This precinct has no election data.</div>
			}
		}
		return (
			<Tabs id="sidebar" activeKey={this.state.key} onSelect={key => this.setState({ key })} transition={false} className="mb-2">
				<Tab eventKey="info" title="Information" >
					{this.props.selectedPrecinct ?
						<Table striped hover>
							<tbody>
								<tr>
									<td><strong>Precinct Name:</strong></td>
									<td>{this.props.selectedPrecinct.name}</td>
								</tr>
							</tbody>
						</Table>
						:
						this.props.selectedState !== "" ?
							<div>
								<h2>Data Sources for This State:</h2>
								<h5>Precincts Data Source:</h5>
								{this.props.states.filter(state => state.abbr === this.props.selectedState).map(state => state.precinctsDataSource)}
								<h5>Elections Data Source:</h5>
								{this.props.states.filter(state => state.abbr === this.props.selectedState).map(state => state.electionsDataSource)}
							</div>
							:
							<div>
								<h2>Welcome to the Precinct Error Correction Program!</h2>
									To begin, please select a state, then select a precinct whose data you would wish to view. It will then be shown here.
							</div>
					}
					{election}
				</Tab>
				<Tab eventKey="err" disabled={this.props.selectedState === ""} title={<div>Errors <Badge variant="danger">{this.state.errorsCount}</Badge></div>}>
					<div>
						{this.state.precinctErrors ?
							<ListGroup>
								{this.state.precinctErrors}
							</ListGroup>
							: <span>There are no known errors in the selected state.</span>
						}
					</div>
				</Tab>
				<Tab eventKey="edit" disabled={this.props.selectedPrecinct === null || this.props.selectedState === ""} title="Tools">
					<Container>
						{this.props.selectedPrecinct &&
							<h2>Precinct {this.props.selectedPrecinct.name}</h2>
						}
						<div className="mb-4">
							<Button block className="text-left" onClick={e => { }}>
								Add Edge
							</Button>
							Add an edge between two precincts.
						</div>
						<div className="mb-4">
							<Button block className="text-left">Combine Precinct</Button> Combine two existing precincts into one.
						</div>
						<div className="mb-4">
							<Button block className="text-left" onClick={e => this.props.enableDrawPolygon()}>
								Edit Boundary Data
							</Button>
							Edit the boundarys for a given precinct. After clicking, draw the new boundaries on the map. <br></br>
							*You can also edit the boundary data by clicking on the polygon in the toolbar in the map.
						</div>
					</Container>
				</Tab>
			</Tabs>
		)
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);