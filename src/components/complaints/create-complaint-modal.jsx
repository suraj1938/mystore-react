import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
class CreateComplaintModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      complaint: "",
      complaintType: "Official",
      validated: true,
    };
  }

  handleChange = async (event) => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;
    await this.setState({
      [name]: value,
    });
  };

  handleSelectChange = async (event) => {
    await this.setState({ complaintType: event.target.value });
  };

  saveComplaint = () => {
    let complaint = {};
    complaint.complaintText = this.state.complaint;
    complaint.complaintType = this.state.complaintType;
    complaint.userId = localStorage.getItem("id");

    fetch(
      "https://mystore-spring.herokuapp.com/api/complaints/createComplaint",
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(complaint),
      }
    ).then((response) => {
      if (response.status === 200) {
        this.props.closeModal("save");
      } else {
        this.props.closeModal("SaveFailed");
      }
    });

    this.setState({ complaint: "" });
    this.setState({ complaintType: "Official" });
  };

  closeComplaint = () => {
    this.props.closeModal("close");
  };
  handleSubmit = (event) => {};
  render() {
    return (
      <div>
        <Modal
          show={this.props.show}
          backdrop="static"
          onHide={this.props.closeModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-tasks"></i> Complaint
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form validated={this.state.validated} onSubmit={this.handleSubmit}>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Complaint Type</Form.Label>
                <Form.Control
                  as="select"
                  onChange={this.handleSelectChange}
                  value={this.state.complaintType}
                >
                  <option value="Official">Official</option>
                  <option value="Personal">Personal</option>
                  <option value="Others">Others</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Detail:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  name="complaint"
                  required
                  value={this.state.complaint}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeComplaint}>
              Close
            </Button>
            <Button
              disabled={this.state.complaint.length === 0}
              variant="primary"
              onClick={this.saveComplaint}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default CreateComplaintModal;
