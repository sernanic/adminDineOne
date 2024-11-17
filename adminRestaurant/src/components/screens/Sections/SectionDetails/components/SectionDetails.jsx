import React from 'react';
import { Card, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, CardHeader, CardBody, useDisclosure } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { Edit } from "lucide-react";

export const SectionDetails = ({ section, onSave }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: section?.name
    }
  });

  const onSubmit = async (data) => {
    try {
      await onSave({ ...data, sortOrder: section.sortOrder });
      onClose();
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  if (!section) return null;

  return (
    <>
      <Card className="w-full">
        <CardHeader className="px-6 py-4 border-b">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-semibold">Details</h2>
            <Button 
              color="primary" 
              variant="light"
              startContent={<Edit className="w-4 h-4" />}
              onClick={onOpen}
            >
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="font-medium">{section.name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Sort Order</p>
                <p className="font-medium">{section.sortOrder}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Category ID</p>
                <p className="font-medium">{section.categoryId}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${!section.deleted ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">{!section.deleted ? 'Active' : 'Deleted'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="border-b">
              <h2 className="text-xl font-semibold">Edit Section</h2>
            </ModalHeader>
            <ModalBody className="py-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <Input
                  {...register("name", { required: "Name is required" })}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  className="w-full"
                />
              </div>
            </ModalBody>
            <ModalFooter className="border-t">
              <Button color="danger" variant="light" onClick={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Save Changes
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
