import React from 'react'
import { Modal, Button, Form, Col } from 'react-bootstrap'
import axios from 'axios'

class EditDemographicsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      demographics: {
        asianPop: "",
        otherPop: "",
        whitePop: "",
        hispanicPop: "",
        blackPop: ""
      },
      submitting: false
    }
  }
  handleClose() {
    this.setState({
      show: false, demographics: {
        asianPop: "",
        otherPop: "",
        whitePop: "",
        hispanicPop: "",
        blackPop: ""
      }
    })
  }
  handleShow() {
    this.setState({ show: true })
  }
  handleOnShow() {
    this.setState({ demographics: JSON.parse(JSON.stringify(this.props.demographics)) })
  }
  handleChange(e) {
    const form = this.state.demographics
    let key = e.target.name;
    let value = e.target.value;
    form[key] = value
    this.setState({ form })
  }
  handleSave() {
    this.setState({ submitting: true })
    const demographics = this.state.demographics
    delete demographics.id

    axios.patch(process.env.REACT_APP_API_URL + `/api/precinct/${this.props.precinct.id}/demographic`, { ...demographics })
      .then(() => {
        this.props.updateDemographics({ ...demographics, id: this.props.precinct.id })
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
          Edit Demographics
         </Button>
        <Modal show={this.state.show} onHide={() => this.handleClose()} onShow={() => this.handleOnShow()}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Demographics</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Row className="mb-2">
              <Col>
                <Form.Control value="White" disabled />
              </Col>
              <Col>
                <Form.Control name="whitePop" value={this.state.demographics.whitePop} onChange={e => this.handleChange(e)} />
              </Col>
            </Form.Row>
            <Form.Row className="mb-2">
              <Col>
                <Form.Control value="Black" disabled />
              </Col>
              <Col>
                <Form.Control name="blackPop" value={this.state.demographics.blackPop} onChange={e => this.handleChange(e)} />
              </Col>
            </Form.Row>
            <Form.Row className="mb-2">
              <Col>
                <Form.Control value="Hispanic" disabled />
              </Col>
              <Col>
                <Form.Control name="hispanicPop" value={this.state.demographics.hispanicPop} onChange={e => this.handleChange(e)} />
              </Col>
            </Form.Row>
            <Form.Row className="mb-2">
              <Col>
                <Form.Control value="Asian" disabled />
              </Col>
              <Col>
                <Form.Control name="asianPop" value={this.state.demographics.asianPop} onChange={e => this.handleChange(e)} />
              </Col>
            </Form.Row>
            <Form.Row className="mb-2">
              <Col>
                <Form.Control value="Other" disabled />
              </Col>
              <Col>
                <Form.Control name="otherPop" value={this.state.demographics.otherPop} onChange={e => this.handleChange(e)} />
              </Col>
            </Form.Row>
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
export default EditDemographicsModal;