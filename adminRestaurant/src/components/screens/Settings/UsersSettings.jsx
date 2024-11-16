import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '../../shared/entityDataTable/EntityDataTable';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { Button, Card, Avatar } from '@nextui-org/react';
import AddUserDialog from './AddUserDialog';
import useMerchantStore from '../../../stores/merchantStore';
// Add these imports
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button as ShadcnButton } from "@/components/ui/button";

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
        {
            accessorKey: 'avatarUrl',
            header: 'Avatar',
            cell: ({ row }) => (
                <Avatar
                    src={row.original.avatarUrl}
                    alt={`${row.original.firstName} ${row.original.lastName}`}
                    size="lg"
                />
            ),
        },
        { accessorKey: 'firstName', header: 'First Name' },
        { accessorKey: 'lastName', header: 'Last Name' },
        { accessorKey: 'uid', header: 'UID' },
        { accessorKey: 'activationCode', header: 'Activation Code' },
        { accessorKey: 'isActive', header: 'Active', cell: ({ row }) => row.original.isActive ? 'Yes' : 'No' },
        { accessorKey: 'isAdmin', header: 'Is Admin', cell: ({ row }) => row.original.isAdmin ? 'Yes' : 'No' },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <ShadcnButton variant="ghost" size="icon">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </ShadcnButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit user
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete user
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
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

    const handleEditUser = (user) => {
        // Implement edit user functionality
        console.log('Edit user:', user);
    };

    const handleDeleteUser = (user) => {
        // Implement delete user functionality
        console.log('Delete user:', user);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <Card className="w-full p-6 bg-white h-[80vh] max-h-[80%] overflow-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Users</h2>
                {/* <Button onClick={handleAddUser} className="bg-black text-white">
                    Add User
                </Button> */}
            </div>
            <DataTable
                data={users || []}
                columns={columns}
                filterColumn="firstName"
                moreActions={[
                    {
                        label: "Add User",
                        onClick: handleAddUser
                    }
                ]}
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
