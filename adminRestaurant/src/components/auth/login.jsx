import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

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
          {isSignUp ? <SignUp /> : <SignIn />}
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
