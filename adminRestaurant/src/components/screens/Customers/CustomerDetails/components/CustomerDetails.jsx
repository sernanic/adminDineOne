import React from "react";
import { Card, CardBody, Divider } from "@nextui-org/react";

export default function CustomerDetails({ customer }) {
  if (!customer) return null;

  return (
    <Card className="w-full">
      <CardBody className="gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-default-500">First Name</p>
              <p className="text-medium">{customer.firstName || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-default-500">Last Name</p>
              <p className="text-medium">{customer.lastName || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-default-500">Username</p>
              <p className="text-medium">{customer.username || 'Not provided'}</p>
            </div>
          </div>
        </div>

        <Divider />

        <div>
          <h2 className="text-lg font-semibold mb-2">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-default-500">Client ID</p>
              <p className="text-medium">{customer.clientId}</p>
            </div>
            <div>
              <p className="text-sm text-default-500">Preferred Merchant ID</p>
              <p className="text-medium">{customer.merchantId}</p>
            </div>
            <div>
              <p className="text-sm text-default-500">Last Updated</p>
              <p className="text-medium">
                {new Date(customer.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
