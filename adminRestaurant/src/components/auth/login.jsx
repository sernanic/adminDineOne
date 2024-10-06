import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update user profile with display name and additional information
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
          photoURL: JSON.stringify({
            firstName,
            lastName,
            restaurantName
          })
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (error) {
      setError(isSignUp ? 'Failed to create an account' : 'Failed to sign in');
      console.error(error);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <motion.div
        className="w-1/2 flex items-center justify-center bg-background"
        initial={false}
        animate={{ x: isSignUp ? "100%" : "0%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="w-96 p-8 bg-card rounded-lg shadow-lg"
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    type="text" 
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    type="text" 
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurantName">Restaurant Name</Label>
                  <Input 
                    id="restaurantName" 
                    type="text" 
                    placeholder="Enter your restaurant name"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <Button className="w-full" type="submit">
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>
        </motion.div>
      </motion.div>
      <motion.div
        className="w-1/2 bg-muted relative overflow-hidden"
        initial={false}
        animate={{ x: isSignUp ? "-100%" : "0%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <img
          src="/src/assets/loginImage.jpg"
          alt="Auth background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold mb-4 text-shadow">Welcome to Dine One</h1>
          <p className="text-xl mb-8 text-shadow">Join our community today!</p>
          <Button onClick={toggleMode} variant="outline" className="text-white border-white hover:bg-white text-black transition-colors">
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
