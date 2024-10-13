import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';

export default function SignUp() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = (data) => {
    setError('');

    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        
        const userData = {
          firstName: data.firstName,
          lastName: data.lastName,
          restaurantName: data.restaurantName,
          email: data.email,
          uid: user.uid
        };

        return updateProfile(user, {
          displayName: `${userData.firstName} ${userData.lastName}`,
        }).then(() => userData);
      })
      .then((userData) => {
        return axios.post('http://127.0.0.1:4000/client', userData);
      })
      .then((response) => {
        console.log('Client created:', response.data);
        navigate('/');
      })
      .catch((error) => {
        setError('Failed to create an account');
        console.error(error);
      });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          {...register("email", { required: "Email is required" })}
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          {...register("password", { required: "Password is required" })}
          placeholder="Enter your password"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input 
          id="confirmPassword" 
          type="password" 
          {...register("confirmPassword", { 
            required: "Please confirm your password",
            validate: (val) => val === watch('password') || "Passwords do not match"
          })}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input 
          id="firstName" 
          type="text" 
          {...register("firstName", { required: "First name is required" })}
          placeholder="Enter your first name"
        />
        {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input 
          id="lastName" 
          type="text" 
          {...register("lastName", { required: "Last name is required" })}
          placeholder="Enter your last name"
        />
        {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="restaurantName">Restaurant Name</Label>
        <Input 
          id="restaurantName" 
          type="text" 
          {...register("restaurantName", { required: "Restaurant name is required" })}
          placeholder="Enter your restaurant name"
        />
        {errors.restaurantName && <p className="text-red-500">{errors.restaurantName.message}</p>}
      </div>
      <Button className="w-full" type="submit">
        Sign Up
      </Button>
    </form>
  );
}
