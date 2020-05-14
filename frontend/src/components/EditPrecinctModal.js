import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import axios from 'axios'

class EditPrecinctModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      form: {
        name: "",
        cName: ""
      },
      submitting: false
    }
  }
  handleClose() {
    this.setState({ show: false, form: { name: "", cName: "" } })
  }
  handleShow() {
    this.setState({ show: true })
  }
  handleOnShow() {
    const form = this.state.form
    form.name = this.props.precinct.name;
    form.cName = this.props.precinct.cname;
    this.setState({ form })
  }
  handleChange(e) {
    const form = this.state.form
    let key = e.target.name;
    let value = e.target.value;
    form[key] = value
    this.setState({ form })
  }
  handleSave() {
    this.setState({ submitting: true })
    axios.patch(process.env.REACT_APP_API_URL + `/api/precinct/${this.props.precinct.id}/names`, { ...this.state.form })
      .then(() => {
        this.props.updatePrecinct({ ...this.state.form, id: this.props.precinct.id })
        this.handleClose()
      })
      .finally(() => {
        this.setState({ submitting: false })
      })
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
                <Form.Control name="cName" type="text" value={this.state.form.cName} onChange={e => this.handleChange(e)} />
              </Form.Group>
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
export default EditPrecinctModal;