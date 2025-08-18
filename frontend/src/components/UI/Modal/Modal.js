import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./Modal.scss";

const ConfirmationModal = ({
  show,
  handleClose,
  handleConfirm,
  title,
  body,
  confirmLabel,
  closeLabel,
  error,
  dialogClassName,
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="mt-5"
      dialogClassName={dialogClassName}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body}
        {error && <div className="text-danger mt-3">{error}</div>}
      </Modal.Body>
      {(closeLabel || confirmLabel) && (
        <Modal.Footer>
          {closeLabel && (
            <Button variant="danger" onClick={handleClose}>
              {closeLabel}
            </Button>
          )}
          {confirmLabel && (
            <Button variant="success" onClick={handleConfirm}>
              {confirmLabel}
            </Button>
          )}
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default ConfirmationModal;
