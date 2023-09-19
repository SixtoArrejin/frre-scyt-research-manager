import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

export default function CustomModal({
  isOpen,
  onClose,
  guardar = false,
  title,
  content,
  onSave,
}) {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <p>{content}</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
          {guardar && (
            <Button
            ml={2}
              onClick={() => {
                onSave();
                onClose();
              }}
              colorScheme="blue"
            >
              Guardar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
