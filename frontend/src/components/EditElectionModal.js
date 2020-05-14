import { Modal, Button, Form, Col } from "react-bootstrap"
import React from "react"

class EditElectionModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      election: {
        results: []
      }
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
    const election = this.state.election
    let value = e.target.value;
    let key = e.target.name;
    election.results[index][key] = value
    this.setState({ election })
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
                  <Form.Row key={candidate.party}>
                    <Col>
                      <Form.Control name="name" value={candidate.name} disabled />
                    </Col>
                    <Col>
                      <Form.Control name="party" placeholder="Last name" value={candidate.party} disabled />
                    </Col>
                    <Col>
                      <Form.Control name="votes" type="number" value={candidate.votes} onChange={e => this.handleChange(e, index)} />
                    </Col>
                  </Form.Row>
                )
              })
              }
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose()} >Close</Button>
            <Button variant="primary">Save changes</Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}
export default EditElectionModal;