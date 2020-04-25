import React, { Component } from "react";
import { Row, Col, Form, Button, Tabs, Tab, Table, ListGroup, Accordion, Card, Badge } from "react-bootstrap"
import L from "leaflet"

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			precinctInfo: {
				name: "N/A",
				population: "N/A",
				winner: "N/A",
				whitePop: "N/A"
			},
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
		return (
			<Tabs id="sidebar" activeKey={this.state.key} onSelect={key => this.setState({ key })} transition={false} className="mb-2">
				<Tab eventKey="info" title="Information" >
					<Table striped hover>
						<tbody>
							<tr>
								<td><strong>Name:</strong></td>
								<td>{this.state.precinctInfo.name}</td>
							</tr>
							<tr>
								<td><strong>Total Population:</strong></td>
								<td>{this.state.precinctInfo.population}</td>
							</tr>
							{/* <tr>
								<td><strong>Winner:</strong></td>
								<td>{information.votes.winner}</td>
							</tr>
							<tr>
								<td><strong>Party:</strong></td>
								<td>{information.votes.party}</td>
							</tr>
							<tr>
								<td><strong>White Population:</strong></td>
								<td>{information.demo.white}</td>
							</tr>
							<tr>
								<td><strong>Black Population:</strong></td>
								<td>{information.demo.black}</td>
							</tr>
							<tr>
								<td><strong>Asian Population:</strong></td>
								<td>{information.demo.asian}</td>
							</tr>
							<tr>
								<td><strong>Hispanic Population:</strong></td>
								<td>{information.demo.hispanic}</td>
							</tr>
							<tr>
								<td><strong>Other Population:</strong></td>
								<td>{information.demo.other}</td>
							</tr> */}
							<tr>
								<td>Sources: </td>
								<td><a href="https://www.census.gov/quickfacts/CA">https://www.census.gov/quickfacts/CA</a></td>
							</tr>
						</tbody>
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
						<Button block onClick={e => new L.Draw.Polyline(this.refs.map.leafletElement).enable()}>Add Edge</Button> Add an edge between two precincts.
                </div>
					<div className="mb-4">
						<Button block>Combine Precinct</Button> Combine two existing precincts into one.
					</div>
					<div className="mb-4">
						<Button block onClick={e => new L.Draw.Polygon(this.refs.map.leafletElement).enable()}>Generate Ghost Precinct</Button> Create a ghost precinct in case an area where the geographic union of precincts does not fully cover the area of the state
					</div>
				</Tab>
			</Tabs>
		)
	}
}
export default Sidebar;