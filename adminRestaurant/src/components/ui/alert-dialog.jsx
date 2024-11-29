import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

export const AlertDialog = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onOpenChange = () => setIsOpen(!isOpen);

  return React.cloneElement(children, { isOpen, onOpenChange });
};

export const AlertDialogTrigger = ({ children, asChild }) => {
  return children;
};

export const AlertDialogContent = ({ children, isOpen, onOpenChange }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
};

export const AlertDialogHeader = ({ children }) => {
  return <ModalHeader>{children}</ModalHeader>;
};

export const AlertDialogTitle = ({ children }) => {
  return <div className="text-lg font-semibold">{children}</div>;
};

export const AlertDialogDescription = ({ children }) => {
  return <ModalBody>{children}</ModalBody>;
};

export const AlertDialogFooter = ({ children }) => {
  return <ModalFooter>{children}</ModalFooter>;
};

export const AlertDialogCancel = ({ children }) => {
  return (
    <Button color="default" variant="light">
      {children}
    </Button>
  );
};

export const AlertDialogAction = ({ children, onClick, className, disabled }) => {
  return (
    <Button 
      color="danger" 
      onClick={onClick} 
      className={className}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};
