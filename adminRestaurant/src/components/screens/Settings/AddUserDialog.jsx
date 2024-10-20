import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const AddUserDialog = ({ isOpen, onClose, onUserAdded }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const addUserMutation = useMutation({
        mutationFn: async (userData) => {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            
            if (!currentUser) {
                throw new Error('User not authenticated');
            }

            const idToken = await currentUser.getIdToken();

            return axios.post('http://127.0.0.1:4000/user/add', userData, {
                headers: {
                    'Authorization': `Bearer ${idToken}`
                }
            });
        },
        onSuccess: () => {
            onUserAdded();
            reset();
        },
        onError: (error) => {
            console.error('Error adding user:', error);
        },
    });

    const onSubmit = (data) => {
        // Convert isAdmin to boolean
        data.isAdmin = !!data.isAdmin;
        addUserMutation.mutate(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right">
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                className="col-span-3"
                                {...register("firstName", { required: "First name is required" })}
                            />
                            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right">
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                className="col-span-3"
                                {...register("lastName", { required: "Last name is required" })}
                            />
                            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="isAdmin" className="text-right">
                                Is Admin
                            </Label>
                            <Checkbox
                                id="isAdmin"
                                {...register("isAdmin")}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={addUserMutation.isLoading}>
                            {addUserMutation.isLoading ? 'Adding...' : 'Add User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserDialog;
