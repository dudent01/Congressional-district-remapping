import { Modal, Button, Form, Col } from "react-bootstrap"
import React from "react"
import axios from "axios"

class EditElectionModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      election: {
        results: []
      },
      submitting: false
    }
  }
  handleClose() {
    this.setState({ show: false, election: { results: [] } })
  }
  handleShow() {
    this.setState({ show: true })
  }
  handleOnShow() {
    this.setState({ election: JSON.parse(JSON.stringify(this.props.election)) })
  }
  handleChange(e, index) {
    console.log(e)
    const election = this.state.election
    let value = e.target.value;
    let key = e.target.name;
    election.results[index][key] = value
    this.setState({ election })
  }
  handleSave() {
    this.setState({ submitting: true })

    const election = this.state.election
    delete election.id;
    for (let result of election.results) {
      delete result.id;
    }

    axios.patch(process.env.REACT_APP_API_URL + `/api/precinct/${this.props.precinct.id}/election`, election)
      .then(() => {
        this.props.updateElection(election);
        this.handleClose();
      })
      .finally(() => {
        this.setState({ submitting: false })
      })
  }
  handleAddRow() {
    this.setState({
      election: {
        ...this.state.election,
        results: [...this.state.election.results, { name: "", party: null, votes: 0 }]
      }
    })
  }
  handleDeleteRow(index) {
    this.setState({
      election: {
        ...this.state.election,
        results: [...this.state.election.results.slice(0, index), ...this.state.election.results.slice(index + 1)]
      }
    })
  }
  render() {
    return (
      <>
        <Button variant="primary" size="sm" onClick={() => this.handleShow()} className="float-right" >
          Edit Election
       </Button>
        <Modal show={this.state.show} onHide={() => this.handleClose()} onShow={() => this.handleOnShow()} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Election</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              {this.state.election.results.map((candidate, index) => {
                return (
                  <Form.Row key={index} className="mb-2">
                    <Col>
                      <Form.Control name="name" value={candidate.name} onChange={e => this.handleChange(e, index)} />
                    </Col>
                    <Col>
                      <Form.Control name="party" as="select" value={candidate.party} onChange={e => this.handleChange(e, index)}>
                        <option>DEMOCRATIC</option>
                        <option>REPUBLICAN</option>
                        <option>LIBERTARIAN</option>
                        <option>GREEN</option>
                        <option>CONSTITUTION</option>
                        <option>OTHER</option>
                      </Form.Control>
                    </Col>
                    <Col>
                      <Form.Control name="votes" type="number" value={candidate.votes} onChange={e => this.handleChange(e, index)} />
                    </Col>
                    <Col xs={2}>
                      <div className="text-center">
                        <Button onClick={() => this.handleDeleteRow(index)}>Delete</Button></div>
                    </Col>
                  </Form.Row>
                )
              })
              }
              <Form.Row className="my-2">
                <Col>
                  <Button onClick={() => this.handleAddRow()}>Add Row</Button>
                </Col>
              </Form.Row>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose()} >Close</Button>
            <Button variant="primary" onClick={() => this.handleSave()} disabled={this.state.submitting}>Save changes</Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}
export default EditElectionModal;