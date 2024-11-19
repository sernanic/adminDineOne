import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import CustomerHeader from "./components/CustomerHeader";
import CustomerDetails from "./components/CustomerDetails";
import { useCustomerDetails } from "./hooks/useCustomerDetails";
import { useAuth } from "@/contexts/AuthContext";

export default function CustomerDetailsScreen() {
  const { customerId } = useParams();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Use the customer data from navigation state if available
  const initialCustomer = location.state?.customer;
  
  const { customer, isLoading, error } = useCustomerDetails({ 
    currentUser,
    customerId,
    initialCustomer // Pass the initial data to the hook
  });

  if (isLoading && !initialCustomer) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error loading customer details: {error.message}</p>
      </div>
    );
  }

  // Use either the fetched customer or the initial customer data
  const customerData = customer || initialCustomer;

  if (!customerData) {
    return (
      <div className="p-4">
        <p className="text-default-500">Customer not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <CustomerHeader customer={customerData} />
      <CustomerDetails customer={customerData} />
    </div>
  );
}
