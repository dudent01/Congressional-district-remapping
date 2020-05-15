import React, { Component } from "react";
import "./App.css";
import { Row, Col } from "react-bootstrap"
import StateMap from "./components/StateMap"
import Sidebar from "./components/Sidebar"

class App extends Component {
  render() {
    return (
      <Row className="h-100" noGutters={true}>
        <Col xs={4} className="p-1 sidebar">
          <Sidebar></Sidebar>
        </Col>
        <Col xs={8} className="h-100">
          <StateMap/>
        </Col>
      </Row>
    );
  }
}
export default App