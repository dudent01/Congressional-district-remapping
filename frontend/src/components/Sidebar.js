import React from "react";
import { Button, Tabs, Tab, Table, ListGroup, Badge, Spinner, Container } from "react-bootstrap"
import { connect } from 'react-redux';
import { enableDrawPolygon, setToolAddNeighbor, setToolDeleteNeighbor, setToolMergePrecincts, unsetTool } from '../actions/MapActions'
import { ADD_NEIGHBOR, DELETE_NEIGHBOR, MERGE_PRECINCTS } from '../actions/types'

const mapStateToProps = s => {
	return {
		selectedPrecinct: s.precincts.selectedPrecinct,
		isFetchingSelectedPrecinct: s.precincts.isFetchingSelectedPrecinct,
		selectedState: s.states.selectedState,
		states: s.states.states,

		toolAction: s.map.toolAction
	}
}
const mapDispatchToProps = dispatch => {
	return {
		enableDrawPolygon: () => dispatch(enableDrawPolygon()),

		setToolAddNeighbor: () => dispatch(setToolAddNeighbor()),
		setToolDeleteNeighbor: () => dispatch(setToolDeleteNeighbor()),
		setToolMergePrecincts: () => dispatch(setToolMergePrecincts()),
		unsetTool: () => dispatch(unsetTool())
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
					<Container>
						{this.props.selectedPrecinct ?
							<>
								<h2>Precinct {this.props.selectedPrecinct.name}</h2>
								<Table striped hover>
									<tbody>
										<tr>
											<td><strong>Precinct Name:</strong></td>
											<td>{this.props.selectedPrecinct.name}</td>
										</tr>
										<tr>
											<td><strong>Canonical Name:</strong></td>
											<td>{this.props.selectedPrecinct.cname}</td>
										</tr>
										<tr>
											<td><strong>Precinct ID:</strong></td>
											<td>{this.props.selectedPrecinct.id}</td>
										</tr>
									</tbody>
								</Table>
							</>
							:
							this.props.selectedState !== "" ?
								<div>
									<h2>Data Sources for This State:</h2>
									<h5>Precincts Data Source:</h5>
									{this.props.states.filter(state => state.abbr === this.props.selectedState).map(state => state.precinctsSource)}
									<h5>Elections Data Source:</h5>
									{this.props.states.filter(state => state.abbr === this.props.selectedState).map(state => state.electionsSource)}
								</div>
								:
								<div>
									<h2>Welcome to the Precinct Error Correction Program!</h2>
									To begin, please select a state, then select a precinct whose data you would wish to view. It will then be shown here.
							</div>
						}
						{election}
					</Container>
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
							<Button block className="text-left" disabled>
								Edit Boundary Data
							</Button>
							<ol>
								<li>To Edit boundary data first select a precinct.</li>
								<li>Next, click on the 'Edit layers' tool in the toolbar on the top left corner of the map.</li>
								<li>Drag the edges around the polygon to change its shape.</li>
								<li>When you are done, hit 'Save' next to the 'Edit layers' tool.</li>
								<li>Confirm if you want to permanently save this change.</li>
							</ol>
						</div>
						<div className="mb-4">
							<Button block className="text-left" 
							onClick={() => this.props.setToolAddNeighbor()}
							disabled={this.props.toolAction !== null}
							>
							{ this.props.toolAction === ADD_NEIGHBOR &&
								<Spinner
									as="span"
									animation="grow"
									size="sm"
									role="status"
									aria-hidden="true"
								/>
							}
								Add Neighbor
							</Button>
							<ol>
								<li>Firstly, click on the Add Neighbor button above.</li>
								<li>To Add a neighbor, simply click on a precinct that you want to add as a neighbor to the currently selected precinct.</li>
							</ol>
						</div>
						<div className="mb-4">
							<Button block className="text-left"
								onClick={() => this.props.setToolDeleteNeighbor()}
								disabled={this.props.toolAction !== null}
							>
								{ this.props.toolAction === DELETE_NEIGHBOR &&
									<Spinner
										as="span"
										animation="grow"
										size="sm"
										role="status"
										aria-hidden="true"
									/>
								}
								Delete Neighbor
								</Button>
							<ol>
								<li>Firstly, click on the Delete Neighbor button above.</li>
								<li>To Delete a neighbor, simply click on a precinct that you want to delete from the currently selected precinct.</li>
							</ol>
						</div>
						<div className="mb-4">
							<Button block className="text-left"
								onClick={() => this.props.setToolMergePrecincts()}
								disabled={this.props.toolAction !== null}
							>
								{ this.props.toolAction === MERGE_PRECINCTS &&
									<Spinner
										as="span"
										animation="grow"
										size="sm"
										role="status"
										aria-hidden="true"
									/>
								}
								Merge Precincts
								</Button>
						</div>
						{this.props.toolAction &&
							<div className="mb-4">
								<Button block className="text-left" variant="danger" disabled={this.props.toolAction == null} onClick={() => this.props.unsetTool()}>Cancel Action</Button>
							</div>
						}
					</Container>
				</Tab>
			</Tabs>
		)
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);