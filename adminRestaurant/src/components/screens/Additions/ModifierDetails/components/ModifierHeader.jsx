import React from 'react';
import { Card, CardBody, Button } from "@nextui-org/react";
import { Edit } from "lucide-react";

export function ModifierHeader({ modifier, onEdit }) {
  if (!modifier) return null;

  return (
    <Card className="w-full">
      <CardBody className="flex flex-row items-center justify-between p-4">
        <div>
          <h1 className="text-2xl font-bold">{modifier.name}</h1>
          <p className="text-gray-500 mt-1">${modifier.price.toFixed(2)}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-1 rounded-full text-xs ${
              modifier.available 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {modifier.available ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>

        <Button
          color="primary"
          variant="flat"
          startContent={<Edit size={18} />}
          onClick={() => onEdit(modifier)}
        >
          Edit Details
        </Button>
      </CardBody>
    </Card>
  );
}
