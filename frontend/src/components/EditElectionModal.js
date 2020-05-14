import { Modal, Button, Form, Col } from "react-bootstrap"
import React from "react"

class EditElectionModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        results: []
      }
    }
  }
  handleClose() {
    this.setState({ show: false, form: { results: [] } })
  }
  handleShow() {
    this.setState({ show: true })
  }
  handleOnShow() {
    this.setState({ form: { results: JSON.parse(JSON.stringify(this.props.results)) } })
    console.log(this.props.results)
  }
  handleChange(e) {
    const form = this.state.form
    let key = e.target.name;
    let value = e.target.value;
    form[key] = value
    this.setState({ form })
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
              {this.state.form.results.map((candidate, index) => {
                return (
                  <Form.Row>
                    <Col>
                      <Form.Control name="name" value={candidate.name} disabled/>
                    </Col>
                    <Col>
                      <Form.Control name="party" placeholder="Last name" value={candidate.party} disabled/>
                    </Col>
                    <Col>
                      <Form.Control name="votes" placeholder="Last name" value={candidate.votes} />
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