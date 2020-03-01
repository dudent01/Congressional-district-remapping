import React, { Component } from "react";
import { Map, GeoJSON, TileLayer } from "react-leaflet";
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'
import { Tab, Tabs, Select, Button, Textarea, Row } from "react-materialize"
import "./App.css";
import { DummyData } from "./DummyData.js"
import { DummyPrecincts } from "./DummyPrecincts"

class App extends Component {

  state = {
    center: [39.8283, -98.5795],
    zoom: 4,
    stateValue: "",
    electionValue: "",
    jsonData: DummyData,
    commentsDisabled: "red lighten-4 disabled",
    resetDisabled: "red lighten-4 disabled",
    dataKey: "DummyData",
    precinctInfo: "Please Click a Precinct",
    precinctErrors: "Please Select A State",
  }

  checkIfError(r){
    if(r.properties.NAME.startsWith("Precinct")){
      if(r.properties.ERRORS.length != 0){
        return {color: "red"};
    }
  }
  }

  onEachFeature(feature, layer) {
    layer.on({
      // mouseover: this.highlightFeature.bind(this),
      // mouseout: this.resetHighlight.bind(this),
      click: this.clickToFeature.bind(this)
    });
  }

  clickToFeature(e) {
    var layer = e.target;
    var name = layer.feature.properties.NAME;
    console.log("I clicked on " + name);
    if (name.startsWith("Precinct")) {
      this.createInformation(layer.feature.properties, layer.feature.information);
    } else {
      this.setCenter(name);
    }
  }

  createInformation(precinct, information) {
    var infoName = "NAME: " + precinct.NAME;
    var infoPop = "POPULATION: " + information.population;
    var infoVotesD = "Democratic Votes: " + information.votes.Democratic
    var infoVotesR = "Republican Votes: " + information.votes.Republican
    var infoDem = "Demographic Data:";
    var infoString = <div>{infoName}<br></br>{infoPop}<br></br>{infoVotesD}<br></br>{infoVotesR}<br></br>{infoDem}<br></br><br></br>Data Sources:<br></br><br></br>Comments:</div>;
    this.setState({ precinctInfo: infoString });
  }

  setCenter(name) {
    if (name === null) {
      this.setState({ center: [39.8283, -98.5795], zoom: 4, stateValue: "", electionValue: "", jsonData: DummyData, dataKey: "DummyData", commentsDisabled: "red lighten-4 disabled", precinctInfo: "Please Select A Precinct", resetDisabled: "red lighten-4 disabled", precinctErrors: "Please Select A State" });
    } else if (name === "California") {
      this.loadErrors(name);
      this.setState({ center: [37.0958, -119.2658], zoom: 6, stateValue: 1, electionValue: 1, jsonData: DummyPrecincts, dataKey: "DummyPrecincts", commentsDisabled: "red lighten-4", resetDisabled: "red lighten-4", });
    } else if (name === "Utah") {
      this.loadErrors(name);
      this.setState({ center: [39.2302, -111.4101], zoom: 7, stateValue: 2, electionValue: 1, jsonData: DummyPrecincts, dataKey: "DummyPrecincts", commentsDisabled: "red lighten-4", resetDisabled: "red lighten-4", });
    } else if (name === "West Virginia") {
      this.loadErrors(name);
      this.setState({ center: [38.8509, -80.4202], zoom: 8, stateValue: 3, electionValue: 1, jsonData: DummyPrecincts, dataKey: "DummyPrecincts", commentsDisabled: "red lighten-4", resetDisabled: "red lighten-4", });
    }
  }

  loadErrors(name) {
    let ErrorsString = [];
    for (let i = 0; i < DummyPrecincts.features.length; i++) {
      if (DummyPrecincts.features[i].properties.ERRORS.length != 0) {
        for (let y = 0; y < DummyPrecincts.features[i].properties.ERRORS.length; y++) {
          ErrorsString.push(<div>{DummyPrecincts.features[i].properties.ERRORS[y].PROBLEM}</div>);
        }
      }
    }
    console.log(ErrorsString);
    this.setState({ precinctErrors: ErrorsString })
  }

  changeOfState(e) {
    var state = e.target.value;
    console.log(state);
    if (state === "1") {
      this.setCenter("California");
    } else if (state === "2") {
      this.setCenter("Utah");
    } else if (state === "3") {
      this.setCenter("West Virginia");
    }
  }

  resetClicked() {
    this.setCenter(null)
  }

  changeOfElection() {

  }

  submitComment() {

  }

  render() {
    return (
      <div style={{ height: "100%" }}>
        <div className="edit-div">
          <div id="edit-modules" className="row">
            <div className="col s4">
              <div id="selector-row" className="row">
                <div className="col s5">
                  <Select
                    onChange={this.changeOfState.bind(this)}
                    options={{
                      classes: '',
                      dropdownOptions: {
                        alignment: 'left',
                        autoTrigger: true,
                        closeOnClick: true,
                        constrainWidth: true,
                        container: null,
                        coverTrigger: true,
                        hover: false,
                        inDuration: 150,
                        onCloseEnd: null,
                        onCloseStart: null,
                        onOpenEnd: null,
                        onOpenStart: null,
                        outDuration: 250
                      }
                    }}
                    value={this.state.stateValue}
                  >
                    <option
                      disabled
                      value=""
                    >
                      Choose Your State</option>
                    <option value="1">
                      California</option>
                    <option value="2">
                      Utah</option>
                    <option value="3">
                      West Virginia</option>
                  </Select></div>
                <div className="col s5">
                  <Select
                    onChange={this.changeOfElection.bind(this)}
                    options={{
                      classes: '',
                      dropdownOptions: {
                        alignment: 'left',
                        autoTrigger: true,
                        closeOnClick: true,
                        constrainWidth: true,
                        container: null,
                        coverTrigger: true,
                        hover: false,
                        inDuration: 150,
                        onCloseEnd: null,
                        onCloseStart: null,
                        onOpenEnd: null,
                        onOpenStart: null,
                        outDuration: 250
                      }
                    }}
                    value=""
                  >
                    <option
                      disabled
                      value={this.state.electionValue}
                    >
                      Choose Your Election</option>
                    <option value="1">
                      2016 Presidential</option>
                    <option value="2">
                      2016 Congressional</option>
                    <option value="3">
                      2018 Congressional</option>
                  </Select></div>
                <div className="col s2">
                  <Button
                    onClick={this.resetClicked.bind(this)}
                    className={this.state.resetDisabled}
                    node="button"
                    style={{
                      marginRight: '5px'
                    }}
                    waves="light"
                  >
                    Reset</Button></div>
              </div>
              <Tabs
                className="tab-demo z-depth-1"
                options={{
                  swipeable: true
                }}
              >
                <Tab
                  active
                  options={{
                    duration: 300,
                    onShow: null,
                    responsiveThreshold: Infinity,
                    swipeable: false
                  }}
                  title="Information"
                >
                  {this.state.precinctInfo}
                </Tab>
                <Tab
                  options={{
                    duration: 300,
                    onShow: null,
                    responsiveThreshold: Infinity,
                    swipeable: false
                  }}
                  title="Errors"
                >
                  {this.state.precinctErrors}
                </Tab>
              </Tabs>
              <div className="row">
                <div className="col s9">
                  <Row>
                    <Textarea
                      l={12}
                      m={12}
                      s={4}
                      xl={12}
                      label="Comments"
                    />
                  </Row>
                </div>
                <div className="col s3">
                  <Button
                    onClick={this.submitComment.bind(this)}
                    className={this.state.commentsDisabled}
                    node="button"
                    style={{
                      marginRight: '5px'
                    }}
                    waves="light"
                  >
                    Submit</Button></div>
              </div>
            </div>
            <Map className="col s8" center={this.state.center} zoom={this.state.zoom} ref={this.mapRef}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <GeoJSON key={this.state.dataKey} data={this.state.jsonData} style={this.checkIfError.bind(this)} onEachFeature={this.onEachFeature.bind(this)}></GeoJSON>
            </Map>
          </div>
        </div>
      </div>
    );
  }
}
export default App