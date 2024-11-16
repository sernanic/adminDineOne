import React from 'react';
import { Button, Card, CardBody } from "@nextui-org/react";

export function DishHeader({ dish }) {
  return (
    <Card className="w-full">
      <CardBody className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{dish?.name}</h1>
              <div className="mt-2 flex gap-2">
                <Button
                  color={dish?.available ? "success" : "danger"}
                  variant="flat"
                  size="sm"
                >
                  {dish?.available ? "Available" : "Unavailable"}
                </Button>
                {dish?.isPopular && (
                  <Button color="warning" variant="flat" size="sm">
                    Popular
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mt-6">
          {dish?.description && (
            <div className="bg-gray-50 p-4 rounded-lg flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <p className="text-gray-700">{dish?.description}</p>
            </div>
          )}
          <div className="flex flex-col gap-3 min-w-[200px]">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Price</p>
              <p className="font-medium text-gray-900 text-xl">
                ${dish?.price ? (parseFloat(dish.price) / 100).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Cost</p>
              <p className="font-medium text-gray-900 text-xl">
                ${dish?.cost ? (parseFloat(dish.cost) / 100).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
