import React from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/react";

export function ModifierDetailsCard({ modifier, className = '' }) {
  if (!modifier) return null;

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="px-4 py-3">
        <h2 className="text-lg font-semibold">Details</h2>
      </CardHeader>

      <CardBody className="px-4 py-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Price</h3>
            <p className="mt-1">${modifier.price.toFixed(2)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Availability</h3>
            <p className="mt-1">
              <span className={`px-2 py-1 rounded-full text-xs ${
                modifier.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {modifier.available ? 'Available' : 'Unavailable'}
              </span>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Created</h3>
            <p className="mt-1">{new Date(modifier.createdTime).toLocaleString()}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Last Modified</h3>
            <p className="mt-1">{new Date(modifier.modifiedTime).toLocaleString()}</p>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1">{modifier.description || 'No description provided'}</p>
          </div>

          {modifier.additionalInfo && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Additional Information</h3>
              <p className="mt-1">{modifier.additionalInfo}</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
