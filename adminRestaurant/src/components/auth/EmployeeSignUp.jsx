import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import axios from 'axios';

export default function EmployeeSignUp() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [error, setError] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const navigate = useNavigate();

  const onSubmit = (data) => {
    setError('');

    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('activationCode:', activationCode)
        console.log('user:', user)

        const userData = {
          email: data.email,
          activationCode,
          uid: user.uid
        };
        return axios.post('http://127.0.0.1:4000/user/activation', userData);
      })
      .then((response) => {
        console.log('User activated:', response.data);
        navigate('/');
      })
      .catch((error) => {
        setError('Failed to create an account');
        console.error(error);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Employee Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                {...register("email", { required: "Email is required" })}
                placeholder="Enter your email"
                className="w-full"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                {...register("password", { required: "Password is required" })}
                placeholder="Enter your password"
                className="w-full"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
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
                className="w-full"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>
            <div className="space-y-2 flex flex-col items-center">
              <Label htmlFor="activationCode" className="text-center">Activation Code</Label>
              <InputOTP 
                maxLength={6} 
                value={activationCode}
                onChange={setActivationCode}
                className="justify-center"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button className="w-full" type="submit">
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-500">
            Already have an account? <a href="/login" className="text-blue-500 hover:underline">Log in</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
