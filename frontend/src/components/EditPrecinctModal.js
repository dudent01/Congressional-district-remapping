import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

class EditPrecinctModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      form: {
        name: "",
        cname: ""
      }
    }
  }
  handleClose() {
    this.setState({ show: false, form: { name: "", cname: "" } })
  }
  handleShow() {
    this.setState({ show: true })
  }
  handleOnShow() {
    const form = this.state.form
    form.name = this.props.precinct.name;
    form.cname = this.props.precinct.cname;
    this.setState({ form })
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
          Edit Precinct
         </Button>
        <Modal show={this.state.show} onHide={() => this.handleClose()} onShow={() => this.handleOnShow()}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Precinct</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Precinct Name</Form.Label>
                <Form.Control name="name" type="text" value={this.state.form.name} onChange={e => this.handleChange(e)} />
              </Form.Group>

              <Form.Group>
                <Form.Label>Canonical Name</Form.Label>
                <Form.Control name="cname" type="text" value={this.state.form.cname} onChange={e => this.handleChange(e)} />
              </Form.Group>
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
export default EditPrecinctModal;