import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '../../shared/entityDataTable/EntityDataTable';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { Button, Card } from '@nextui-org/react';
import AddUserDialog from './AddUserDialog';
import useMerchantStore from '../../../stores/merchantStore';

const UsersSettings = () => {
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
    const selectedMerchantId = useMerchantStore(state => state.selectedMerchantId);

    const { data: users, isLoading, error, refetch } = useQuery({
        queryKey: ['users', selectedMerchantId],
        queryFn: async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                throw new Error('User not authenticated');
            }
            const token = await user.getIdToken();
            const response = await axios.get('http://127.0.0.1:4000/users/list', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        },
        enabled: !!selectedMerchantId,
    });
    
    const columns = [
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', header: 'Last Name' },
        { accessorKey: 'uid', header: 'UID' },
        { accessorKey: 'activationCode', header: 'Activation Code' },
        { accessorKey: 'isActive', header: 'Active', cell: ({ row }) => row.original.isActive ? 'Yes' : 'No' },
        { accessorKey: 'isAdmin', header: 'Is Admin', cell: ({ row }) => row.original.isAdmin ? 'Yes' : 'No' },
    ];

    const handleAddUser = () => {
        setIsAddUserDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsAddUserDialogOpen(false);
    };

    const handleUserAdded = () => {
        refetch();
        handleCloseDialog();
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <Card className="w-full p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Users</h2>
                <Button onClick={handleAddUser} className="bg-black text-white">
                    Add User
                </Button>
            </div>
            <DataTable
                data={users || []}
                columns={columns}
                filterColumn="firstName"
            />
            <AddUserDialog
                isOpen={isAddUserDialogOpen}
                onClose={handleCloseDialog}
                onUserAdded={handleUserAdded}
            />
        </Card>
    );
};

export default UsersSettings;
