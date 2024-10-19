import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getAuth } from 'firebase/auth';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileDrawer({ isOpen, setIsOpen }) {
  const [avatarUrl, setAvatarUrl] = useState('/placeholder.svg?height=100&width=100');
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    }
  });

  const firstName = watch('firstName');
  const lastName = watch('lastName');

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const getCurrentUser = () => {
    const auth = getAuth();
    return auth.currentUser;
  };

  const fetchUserData = async () => {
    try {
        console.log("hello")
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      const userId = currentUser.uid;
      const authToken = await currentUser.getIdToken();

      const response = await fetch(`http://127.0.0.1:4000/user/${userId}/view`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      
      // Autopopulate the form fields
      setValue('firstName', userData.firstName);
      setValue('lastName', userData.lastName);
      setValue('email', userData.email);
      
      // Set avatar URL if available
      if (userData.avatarUrl) {
        setAvatarUrl(userData.avatarUrl);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadEnd = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      const userId = currentUser.uid;
      const authToken = await currentUser.getIdToken();

      const response = await fetch(`http://127.0.0.1:4000/user/${userId}/edit`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      const result = await response.json();
      console.log('User updated successfully', result);
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleResetPassword = () => {
    // Here you would typically trigger your password reset flow
    console.log('Reset password requested');
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full max-w-[500px] bg-background shadow-xl transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out overflow-y-auto`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>×</Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={avatarUrl} alt="Profile picture" />
                  <AvatarFallback>
                    {firstName.charAt(0)}
                    {lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="picture" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2">
                    Upload Picture
                  </Label>
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...register('firstName', { required: 'First name is required' })}
                    />
                    {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...register('lastName', { required: 'Last name is required' })}
                    />
                    {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>
                <div className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResetPassword}
                    className="w-full"
                  >
                    Reset Password
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleSubmit(onSubmit)}>Save changes</Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
