import React, { Component } from "react";
import { Map, GeoJSON, TileLayer, FeatureGroup, Circle } from "react-leaflet";
import { EditControl } from "react-leaflet-draw"
import "./App.css";
import axios from "axios"
import { Row, Col, Form, Button, Tabs, Tab, Table, ListGroup, Accordion, Card, Badge } from "react-bootstrap"
import L from "leaflet"

class App extends Component {

  state = {
    center: [39.8283, -98.5795],
    zoom: 4,
    electionValue: "",
    isLoading: true,
    geoJson: undefined,
    USStates: undefined,
    commentsDisabled: "red lighten-4 disabled",
    resetDisabled: "",
    dataKey: "",
    precinctInfo: "Please Click a Precinct",
    precinctErrors: "Please Select A State",
    key: 'info',
    comments: [],
    errorsCount: 0
  }

  componentDidMount() {
    this.loadStates();
  }

  loadStates() {
    axios.get("http://localhost:8080/api/state").then((response) => {
      response.data.forEach(state => state.geojson = JSON.parse(state.geojson))
      var x = {type: "FeatureCollection", features: response.data.map(state => state.geojson)};
      this.setState({ USStates: x, geoJson: x, isLoading: false});
    });
  }

  checkIfError(r) {
    if (r.properties.NAME !== undefined && r.properties.NAME.startsWith("Precinct")) {
      if (r.properties.ERRORS.length !== 0) {
        return { color: "red" };
      }
    }
  }
  highlightFeature(e) {
    var layer = e.target;
    if (layer.feature.information)
      this.createInformation(layer.feature.properties, layer.feature.information);
  }

  onEachFeature(feature, layer) {
    layer.on({
      // mouseover: this.highlightFeature.bind(this),
      // mouseout: this.resetHighlight.bind(this),
      click: this.clickToFeature.bind(this)
    });
  }

  clickToFeature(e) {
    console.log(e)
    var layer = e.target;
    var name = layer.feature.properties.NAME;
    if (name === undefined) {
      let precinct = {NAME: "Default"}
      let info = {population: 800, votes: {winner: "John Doe", party: "OTHER", votes: 421}, demo: {white: 400, black: 200, asian: 50, hispanic: 100, other: 50}}
      this.createInformation(precinct, info);
      this.highlightNeighbors();
    } else{
      this.setCenter(name);
      this.setState({isLoading: true})
      axios.get("http://localhost:8080/api/precinct/state/" + layer.feature.properties.ABBR).then((response) => {
        response.data.forEach(state => state.geojson = JSON.parse(state.geojson))
        var x = {type: "FeatureCollection", features: response.data.map(state => state.geojson)};
        this.setState({ geoJson: x, isLoading: false});
      });
    }
    console.log(this.refs)
    this.setState({ key: "info" })
    // Assumming you have a Leaflet map accessible
  }

  highlightNeighbors() {
    console.log("Highlight Neighbors Called");
  }

  createInformation(precinct, information) {
    var temp =
      <div>
        <Table striped hover>
          <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{precinct.NAME}</td>
            </tr>
            <tr>
              <td><strong>Total Population:</strong></td>
              <td>{information.population}</td>
            </tr>
            <tr>
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
            </tr>
            <tr>
              <td>Sources: </td>
              <td><a href="https://www.census.gov/quickfacts/CA">https://www.census.gov/quickfacts/CA</a></td>
            </tr>
          </tbody>
        </Table>
      </div>
    this.setState({ precinctInfo: temp });
  }

  setCenter(name) {
    if (name == null) {
      this.setState({ center: [39.8283, -98.5795], zoom: 4, electionValue: "", precinctInfo: "Please Click a Precinct", precinctErrors: "Please Select A State", errorsCount: 0 });
    } else if (name === "California") {
      this.loadErrors(name);
      this.setState({ center: [37.0958, -119.2658], zoom: 6, electionValue: 1, commentsDisabled: "red lighten-4", resetDisabled: "red lighten-4", });
    } else if (name === "Utah") {
      this.loadErrors(name);
      this.setState({ center: [39.2302, -111.4101], zoom: 7, electionValue: 1, commentsDisabled: "red lighten-4", resetDisabled: "red lighten-4", });
    } else if (name === "West Virginia") {
      this.loadErrors(name);
      this.setState({ center: [38.8509, -80.4202], zoom: 7, electionValue: 1, commentsDisabled: "red lighten-4", resetDisabled: "red lighten-4", });
    }
  }
  setCenterError(center, zoom) {
    let x = [center[0][1], center[0][0]]
    this.setState({ center: x, zoom })
  }

  loadErrors(name) {
    this.setState({precinctErrors: "No errors available for " + name + "."});
    console.log("Load Errors Called");
  }

  changeOfState(e) {
    var state = e.target.value;
    if (state === "1") {
      this.setCenter("California");
    } else if (state === "2") {
      this.setCenter("Utah");
    } else if (state === "3") {
      this.setCenter("West Virginia");
    }
  }

  resetClicked() {
    this.setCenter(null);
    this.setState({isLoading: true});
    this.setState({geoJson: this.state.USStates, isLoading: false});

  }

  changeOfElection(e) {
    let electionValue = e.target.value;
    this.setState({ electionValue });
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

  submitComment() {
    console.log("Submit Comment Called");
  }

  render() {

    return (
      <Row className="h-100" noGutters={true}>
        <Col xs={4} className="p-1" id="sidebar" >
          <Tabs activeKey={this.state.key} onSelect={key => this.setState({ key })} transition={false} className="mb-2">
            <Tab eventKey="info" title="Information" >
              {this.state.precinctInfo}
            </Tab>
            <Tab eventKey="err" title={<div>Errors <Badge variant="danger">{this.state.errorsCount}</Badge></div>}>
              <div>
                <ListGroup>
                  {this.state.precinctErrors}
                </ListGroup>
              </div>
            </Tab>
            <Tab eventKey="comment" title="Comments">
              <Form.Group controlId="exampleForm.ControlTextarea1" className="p-2">
                <Form.Label>Add Comment</Form.Label>
                <Form.Control as="textarea" rows="2" className="mb-2" />
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form.Group>
              <Accordion defaultActiveKey="-1">
                <Accordion.Toggle eventKey="0" as={Button} variant="link">Show Comments...</Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <div>
                    <Card body>
                      <h6>03/01/2020 3:29PM</h6>The precinct population data needs to be updated for 2020 census.
                    </Card>
                    <Card body>
                      <h6>02/20/2019 11:02PM</h6>
                      Congressional results are inaccurate for 2016 in West Virginia.
                    </Card>
                    <Card body>
                      <h6>02/12/2019 06:45PM</h6>
                      I like this application.
                    </Card>
                  </div>
                </Accordion.Collapse>
              </Accordion>

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
        </Col>
        <Col xs={8} className="h-100">
          <Map id="leaflet-map" center={this.state.center} zoom={this.state.zoom} ref="map">
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
              <Circle center={[51.51, -0.06]} radius={200} />
            </FeatureGroup>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {!this.state.isLoading ? (<GeoJSON key={this.state.dataKey} data={this.state.geoJson} style={this.checkIfError.bind(this)} onEachFeature={this.onEachFeature.bind(this)}></GeoJSON>): null}
          </Map>
          <div className="leaflet-right leaflet-top" style={{ "pointerEvents": "auto" }}>
            <Form inline className="m-2">
              <Form.Control as="select" placeholder="Select one" className="mr-2"
                value={this.state.stateValue}
                onChange={this.changeOfState.bind(this)}>
                <option value="" disabled> Select State</option>
                <option value="1">California</option>
                <option value="2">Utah</option>
                <option value="3">West Virginia</option>
              </Form.Control>
              <Form.Control as="select" className="mr-2" onChange={this.changeOfElection.bind(this)} value={this.state.electionValue}>
                <option value="" disabled>Select Election</option>
                <option value="1">
                  2016 Presidential</option>
                <option value="2">
                  2016 Congressional</option>
                <option value="3">
                  2018 Congressional</option>
              </Form.Control>
              <Button className="ml-auto"
                onClick={this.resetClicked.bind(this)}>Reset</Button>
            </Form>
          </div>
        </Col>
      </Row>
    );
  }
}
export default App