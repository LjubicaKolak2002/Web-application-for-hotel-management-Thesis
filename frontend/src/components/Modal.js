import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmationModal = ({ show, handleClose, handleConfirm, title, body, confirmLabel, closeLabel, error }) => {
    return (
        <Modal show={show} onHide={handleClose} className="mt-5">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {body}
                {error && <div className="text-danger mt-3">{error}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {closeLabel}
                </Button>
                <Button variant="danger" onClick={handleConfirm}>
                    {confirmLabel}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModal;
