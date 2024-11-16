import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
} from "@nextui-org/react";

export function DishDetailsCard({ dish }) {
  return (
    <Card className="w-full">
      <CardHeader className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">Details</h2>
      </CardHeader>
      <CardBody className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Item ID</p>
              <p className="font-medium">{dish?.itemId}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Price Type</p>
              <p className="font-medium">{dish?.priceType}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Last Modified</p>
              <p className="font-medium">
                {dish?.modifiedTime ? new Date(dish.modifiedTime).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${dish?.available ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${dish?.hidden ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                <span className="text-sm">Hidden</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${dish?.isPopular ? 'bg-purple-500' : 'bg-gray-300'}`} />
                <span className="text-sm">Popular</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${dish?.autoManage ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <span className="text-sm">Auto Manage</span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
