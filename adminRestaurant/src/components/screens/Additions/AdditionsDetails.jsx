import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { DataTable } from "@/components/shared/entityDataTable/EntityDataTable"
import { columns } from "./ModifierColumns"

const AdditionsDetails = () => {
  const { merchantId, modifierGroupId } = useParams();
  const [modifierGroupName, setModifierGroupName] = useState('');
  const [modifiers, setModifiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModifierGroupData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
          throw new Error('User not authenticated');
        }
        const idToken = await user.getIdToken();
        
        const response = await axios.get(`http://127.0.0.1:4000/modifiers/${merchantId}/modifierGroup/${modifierGroupId}`, {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        });
        
        setModifierGroupName(response.data.name || 'Addition Details');
        setModifiers(response.data.modifiers || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching modifier group data:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchModifierGroupData();
  }, [merchantId, modifierGroupId]);

  const handleSync = () => {
    // Implement sync functionality if needed
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Additions', link: '/additions' },
    { label: modifierGroupName },
  ];
  

  return (
    <div className="flex flex-col w-full h-full p-4">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex justify-center items-center mt-4" style={{width: '100%', height: '100%'}}>
        <div className="bg-white rounded-lg p-4" style={{width: '95%', height: '100%'}}>
          <h3 className="text-xl font-semibold mb-2">Modifiers for {modifierGroupName}</h3>
          <DataTable
            data={modifiers}
            columns={columns}
            filterColumn="name"
            onSync={handleSync}
            isSyncing={false}
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionsDetails;
