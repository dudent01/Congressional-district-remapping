import React, { Component } from "react";
import "./App.css";
import { Row, Col, Form, Button, Tabs, Tab, Table, ListGroup, Accordion, Card, Badge } from "react-bootstrap"
import StateMap from "./components/StateMap"
import Sidebar from "./components/Sidebar"
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    data: state.data
  };
};
class App extends Component {

  state = {
    electionValue: "",
    dataKey: "",
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

  highlightNeighbors() {
    console.log("Highlight Neighbors Called");
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


  changeOfElection(e) {
    let electionValue = e.target.value;
    this.setState({ electionValue });
  }


  render() {
    return (
      <Row className="h-100" noGutters={true}>
        <Col xs={4} className="p-1">
          <Sidebar></Sidebar>
        </Col>
        <Col xs={8} className="h-100">
          <StateMap/>
        </Col>
      </Row>
    );
  }
}
export default connect(mapStateToProps,null)(App)