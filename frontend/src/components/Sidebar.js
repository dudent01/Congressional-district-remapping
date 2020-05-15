import React from "react";
import { Button, Tabs, Tab, Table, ListGroup, Badge, Spinner, Container, Row, Col, Tooltip, OverlayTrigger, Accordion, Card, ListGroupItem } from "react-bootstrap"
import { connect } from 'react-redux';
import { enableDrawPolygon, setToolAddNeighbor, setToolDeleteNeighbor, setToolMergePrecincts, setToolDrawNewBoundary, unsetTool } from '../actions/mapActions'
import { updatePrecinct, updateElection, updateDemographics, fetchPrecinctData } from '../actions/precinctActions'
import { ADD_NEIGHBOR, DELETE_NEIGHBOR, MERGE_PRECINCTS, DRAW_NEW_BOUNDARY } from '../actions/types'
import EditPrecinctModal from './EditPrecinctModal'
import EditElectionModal from './EditElectionModal'
import EditDemographicsModal from './EditDemographicsModal'
import numeral from 'numeral'
import L from 'leaflet'

const mapStateToProps = s => {
	return {
		selectedPrecinct: s.precincts.selectedPrecinct,
		isFetchingSelectedPrecinct: s.precincts.isFetchingSelectedPrecinct,
		isFetching: s.precincts.isFetching,
		errors: s.precincts.errors,
		precinctGeojson: s.precincts.geojson,
		precincts: s.precincts.precincts,

		selectedState: s.states.selectedState,
		states: s.states.states,

		toolAction: s.map.toolAction,
		map: s.map.map,
		electionType: s.map.electionType
	}
}
const mapDispatchToProps = dispatch => {
	return {
		enableDrawPolygon: () => dispatch(enableDrawPolygon()),

		setToolAddNeighbor: () => dispatch(setToolAddNeighbor()),
		setToolDeleteNeighbor: () => dispatch(setToolDeleteNeighbor()),
		setToolMergePrecincts: () => dispatch(setToolMergePrecincts()),
		setToolDrawNewBoundary: () => dispatch(setToolDrawNewBoundary()),
		unsetTool: () => dispatch(unsetTool()),
		updatePrecinct: (data) => dispatch(updatePrecinct(data)),
		updateElection: (election) => dispatch(updateElection(election)),
		updateDemographics: (demographics) => dispatch(updateDemographics(demographics)),

		onSelectPrecinct: (id, election, precincts) => {
			dispatch(fetchPrecinctData(id, election, precincts))
		},
	}
}

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errorsCount: 0,
			key: null,
			mapStateAbbrToName: {
				UT: "Utah",
				CA: "California",
				WV: "West Virginia"
			},
			activeKey: -1
		}
	}
	componentWillReceiveProps(nextProps) {
		if (!nextProps.selectedPrecinct) {
			this.setState({ key: "info" })
		}
	}
	handleZoomInterestPoints(interestPoints) {
		let coordinates = JSON.parse(interestPoints)
		let geojson = {
			type: "Feature",
			geometry: {
				type: "Polygon",
				coordinates: [coordinates]
			},
			properties: {}
		}
		// console.log(this.props.map.getBounds())
		let leafletGeojson = new L.GeoJSON(geojson)
		let layers = Object.keys(leafletGeojson._layers)
		console.log(leafletGeojson._layers[layers[0]]._bounds)
		this.props.map.fitBounds(leafletGeojson._layers[layers[0]]._bounds)
	}
	handleZoomPrecinct(id) {
		this.props.onSelectPrecinct(id, this.props.electionType, this.props.precincts)
		let geojson = this.props.precinctGeojson.features.find(p => p.properties.id === id)
		console.log(geojson)
		let leafletGeojson = new L.GeoJSON(geojson)
		let layers = Object.keys(leafletGeojson._layers)
		console.log(leafletGeojson)
		console.log(leafletGeojson._layers[layers[0]]._bounds)
		this.props.map.fitBounds(leafletGeojson._layers[layers[0]]._bounds)
	}
	toggleAccordion(index) {
		if (this.state.activeKey === index) {
			this.setState({activeKey: -1})
		}
		else {
			this.setState({activeKey: index})
		}
	}
	renderTooltip(id) {
		if (id === 0) {
			return (
				<Tooltip id="button-tooltip">
					<p>*NOTE: You cannot edit Multipolygons. You must Draw a new boundary if you wish to change it.</p>
					<ol className="text-left" style={{ paddingLeft: 15 }}>
						<li>To Edit boundary data first select a precinct.</li>
						<li>Next, click on the 'Edit layers' tool in the toolbar on the top left corner of the map.</li>
						<li>Drag the edges around the polygon to change its shape.</li>
						<li>When you are done, hit 'Save' next to the 'Edit layers' tool.</li>
						<li>Confirm if you want to permanently save this change.</li>
					</ol>
				</Tooltip>
			);
		}
		else if (id === 1) {
			return (
				<Tooltip id="button-tooltip">
					<ol className="text-left" style={{ paddingLeft: 15 }}>
						<li>First, click on the Add Neighbor button to the left.</li>
						<li>To add a neighbor, simply click on a precinct that you want to add as a neighbor to the currently selected precinct.</li>
					</ol>
				</Tooltip>
			);
		} else if (id === 2) {
			return (
				<Tooltip id="button-tooltip">
					<ol className="text-left" style={{ paddingLeft: 15 }}>
						<li>First, click on the Delete Neighbor button to the left.</li>
						<li>To delete a neighbor, simply click on a precinct that you want to delete from the currently selected precinct.</li>
					</ol>
				</Tooltip>
			);
		} else if (id === 3) {
			return (
				<Tooltip id="button-tooltip">
					<ol className="text-left" style={{ paddingLeft: 15 }}>
						<li>First, click on the Merge Precincts button to the left.</li>
						<li>To merge two precincts, click on the precinct you want to merge with the one already selected.</li>
						<li>You will have to confirm you want to do this action after selecting the precinct.</li>
					</ol>
				</Tooltip>
			)
		} else if (id === 4) {
			return (
				<Tooltip id="button-tooltip">
					<p>*NOTE: Draw new boundary is used to address the issue of Multipolygon.</p>
					<ol className="text-left" style={{ paddingLeft: 15 }}>
						<li>First, click on the Draw New Boundary button to the left.</li>
						<li>Next, click on the Draw a polygon tool on the top left corner of the map.</li>
						<li>Draw the desired polygon to replace the currently selected precinct's</li>
						<li>You will have to confirm you want to do this action after selecting the precinct.</li>
					</ol>
				</Tooltip>
			);
		}
	}

	render() {
		let election = null;
		let demographics = null;
		if (this.props.selectedPrecinct) {
			if (this.props.selectedPrecinct.election) {
				election = <>
					<b className="text-center">{this.props.selectedPrecinct.election.type.replace("_", " ")}</b>
					<EditElectionModal precinct={this.props.selectedPrecinct} election={this.props.selectedPrecinct.election} updateElection={(election) => this.props.updateElection(election)} />
					<Table hover variant="danger" bordered>
						<tbody>
							<tr>
								<th>Name</th>
								<th>Politcal Party</th>
								<th>Votes</th>
							</tr>
							{this.props.selectedPrecinct.election.results.map((candidate, index) => {
								return (
									<tr key={candidate.party}>
										<td>{candidate.name}</td>
										<td>{candidate.party}</td>
										<td>{numeral(candidate.votes).format('0,0')}</td>
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

			if (this.props.selectedPrecinct.demographics) {
				demographics = <>
					<b className="text-center">Demographics</b>
					<EditDemographicsModal precinct={this.props.selectedPrecinct} demographics={this.props.selectedPrecinct.demographics} updateDemographics={(demographics) => this.props.updateDemographics(demographics)} />
					<Table hover variant="primary" bordered>
						<tbody>
							<tr>
								<th>Race</th>
								<th>Population</th>
							</tr>
							<tr>
								<td>White</td>
								<td>{numeral(this.props.selectedPrecinct.demographics.whitePop).format('0,0')}</td>
							</tr>
							<tr>
								<td>Black</td>
								<td>{numeral(this.props.selectedPrecinct.demographics.blackPop).format('0,0')}</td>
							</tr>
							<tr>
								<td>Hispanic</td>
								<td>{numeral(this.props.selectedPrecinct.demographics.hispanicPop).format('0,0')}</td>
							</tr>
							<tr>
								<td>Asian</td>
								<td>{numeral(this.props.selectedPrecinct.demographics.asianPop).format('0,0')}</td>
							</tr>
							<tr>
								<td>Other</td>
								<td>{numeral(this.props.selectedPrecinct.demographics.otherPop).format('0,0')}</td>
							</tr>
						</tbody>
					</Table>
				</>
			}
		}
		return (
			<Tabs id="sidebar" activeKey={this.state.key} onSelect={key => this.setState({ key })} transition={false} className="mb-2">
				<Tab eventKey="info" title="Information" >
					<Container>
						{this.props.selectedPrecinct ?
							<>
								<div>
									<h2>Precinct {this.props.selectedPrecinct.name}
										<EditPrecinctModal precinct={this.props.selectedPrecinct} updatePrecinct={(data) => this.props.updatePrecinct(data)} />
									</h2>
								</div>
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
								<>
									<h2>Data Sources for {this.state.mapStateAbbrToName[this.props.selectedState]}</h2>
									<Table striped hover>
										<tbody>
											<tr>
												<td><strong>Precincts Data</strong></td>
												<td>{this.props.states.filter(state => state.abbr === this.props.selectedState).map(state => state.precinctsSource)}</td>
											</tr>
											<tr>
												<td><strong>Elections Data</strong></td>
												<td>{this.props.states.filter(state => state.abbr === this.props.selectedState).map(state => state.electionsSource)}</td>
											</tr>
											<tr>
												<td><strong>State Boundary</strong></td>
												<td>Data.gov</td>
											</tr>
											<tr>
												<td><strong>Demographic Data</strong></td>
												<td>U.S Census (API)</td>
											</tr>
										</tbody>
									</Table>
									{this.props.isFetching &&
										<div className="text-center">
											<Spinner animation="border" variant="primary" />
											<h2>Loading Precincts...</h2>
										</div>
									}
								</>
								:
								<div>
									<h2>Welcome to the Precinct Error Correction Program!</h2>
									To begin, please select a state, then select a precinct whose data you would wish to view. It will then be shown here.
							</div>
						}
						{election}
						{demographics}
					</Container>
				</Tab>
				<Tab eventKey="err" disabled={this.props.selectedState === ""} title={<div>Errors</div>}>
					<div>
						{this.props.errors &&
							<Accordion defaultActiveKey="0" activeKey={this.state.activeKey}>
								{Object.keys(this.props.errors).map((errorType, index) => {
									return (
										<Card key={errorType}>
											<Card.Header>
												<Accordion.Toggle as={Button} variant="link" eventKey={index} onClick={() =>  this.toggleAccordion(index)}>
													{errorType} 
												</Accordion.Toggle><Badge variant="danger">{this.props.errors[errorType].length}</Badge>
											</Card.Header>
											<Accordion.Collapse eventKey={index}> 
												<ListGroup>
													{this.props.errors[errorType].map(error => {
														if (this.state.activeKey === index)
															switch(errorType) {
																case 'Overlapping Errors':
																	return (
																		<ListGroupItem key={error.id}>
																			Overlapping No.{error.id}
																			<Button onClick={this.handleZoomInterestPoints.bind(this, error.interestPoints)}>View On Map</Button>
																		</ListGroupItem>
																	)
																case 'Enclosed Errors':
																	return (
																		<ListGroupItem key={error.id}>
																			Enclosed No.{error.id}<br/>
																			<span className="link" onClick={this.handleZoomPrecinct.bind(this, error.containerPrecinctId)}>Precinct ID: {error.containerPrecinctId}</span><br/>
																			<span className="link" onClick={this.handleZoomPrecinct.bind(this, error.enclosedPrecinctId)}>Precinct ID: {error.enclosedPrecinctId}</span><br/>
																			<Button onClick={this.handleZoomInterestPoints.bind(this, error.interestPoints)}>View On Map</Button>
																		</ListGroupItem>
																	)
																case 'Unclosed Errors':
																	break;
																case 'Anomalous Data Errors':
																	break;
																case 'Map Coverage Errors':
																	break;
																case 'Multi Polygon Errors':
																	return (
																		<ListGroupItem key={error.id}>
																			Multi Polygon No.{error.id}
																			<Button onClick={this.handleZoomPrecinct.bind(this, error.precinctId)}>View On Map</Button>
																		</ListGroupItem>
																	)
																default:
																	return null
															}
														else
															return null
													})}
												</ListGroup>
											</Accordion.Collapse>
										</Card>
									)
								})}
							</Accordion>
						}
					</div>
				</Tab>
				<Tab eventKey="edit" disabled={this.props.selectedPrecinct === null || this.props.selectedState === ""} title="Map Tools">
					<Container>
						{this.props.selectedPrecinct &&
							<h2>Precinct {this.props.selectedPrecinct.name}</h2>
						}
						<h5 className="my-4 text-info">
							*Click on a button to begin an action on the currently selected precinct.
						</h5>
						<div className="mb-4">
							<Row>
								<Col xs={10}>
									<Button
										block className="text-left"
										onClick={() => this.props.setToolDrawNewBoundary()}
										disabled={this.props.toolAction !== null}
									>
										{this.props.toolAction === DRAW_NEW_BOUNDARY &&
											<Spinner
												as="span"
												animation="grow"
												size="sm"
												role="status"
												aria-hidden="true"
											/>
										}
										Draw New Boundary
									</Button>
								</Col>
								<Col xs={2}>
									<OverlayTrigger
										placement="left"
										delay={{ show: 250, hide: 400 }}
										overlay={this.renderTooltip(4)}
									>
										<Button block>
											?
							</Button>
									</OverlayTrigger>
								</Col>
							</Row>
						</div>
						<div className="mb-4">
							<Row>
								<Col xs={10}>
									<Button block className="text-left" disabled>
										Edit Boundary Data
									</Button>
								</Col>
								<Col xs={2}>
									<OverlayTrigger
										placement="left"
										delay={{ show: 250, hide: 400 }}
										overlay={this.renderTooltip(0)}
									>
										<Button block>
											?
							</Button>
									</OverlayTrigger>
								</Col>
							</Row>
						</div>
						<div className="mb-4">
							<Row>
								<Col xs={10}>
									<Button block className="text-left"
										onClick={() => this.props.setToolAddNeighbor()}
										disabled={this.props.toolAction !== null}
									>
										{this.props.toolAction === ADD_NEIGHBOR &&
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
								</Col>
								<Col xs={2}>
									<OverlayTrigger
										placement="left"
										delay={{ show: 250, hide: 400 }}
										overlay={this.renderTooltip(1)}
									>
										<Button block>
											?
									</Button>
									</OverlayTrigger>
								</Col>
							</Row>
						</div>
						<div className="mb-4">
							<Row>
								<Col xs={10}>
									<Button block className="text-left"
										onClick={() => this.props.setToolDeleteNeighbor()}
										disabled={this.props.toolAction !== null}
									>
										{this.props.toolAction === DELETE_NEIGHBOR &&
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
								</Col>
								<Col xs={2}>
									<OverlayTrigger
										placement="left"
										delay={{ show: 250, hide: 400 }}
										overlay={this.renderTooltip(2)}
									>
										<Button block>
											?
							</Button>
									</OverlayTrigger>
								</Col>
							</Row>
						</div>
						<div className="mb-4">
							<Row>
								<Col xs={10}>
									<Button block className="text-left"
										onClick={() => this.props.setToolMergePrecincts()}
										disabled={this.props.toolAction !== null}
									>
										{this.props.toolAction === MERGE_PRECINCTS &&
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
								</Col>
								<Col xs={2}>
									<OverlayTrigger
										placement="left"
										delay={{ show: 250, hide: 400 }}
										overlay={this.renderTooltip(3)}
									>
										<Button block>
											?
							</Button>
									</OverlayTrigger>
								</Col>
							</Row>
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