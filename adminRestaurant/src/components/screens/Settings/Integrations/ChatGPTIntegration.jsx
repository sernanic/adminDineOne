import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; 
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import ChatGPTForm from '../IntegrationForms/ChatGPTForm';

const ChatGPTIntegration = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleCardClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = (isOpen) => {
    setIsDialogOpen(isOpen);
    if (!isOpen) {
      setFormErrors({});
      reset();
    }
  };

  const onSubmit = async (data) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const idToken = await user.getIdToken();

      const response = await axios.post('http://127.0.0.1:4000/chatgpt/integration', {
        apiKey: data.apiKey
      }, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });

      if (response.status === 200) {
        console.log('ChatGPT integration saved successfully');
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error saving ChatGPT integration:', error);
      setFormErrors({ apiError: { message: 'Failed to save ChatGPT integration. Please try again.' } });
    }
  };

  return (
    <>
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleCardClick}
      >
        <CardHeader>
          <CardTitle className="text-center">ChatGPT</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-4">
            <img src="/src/assets/chatgpt.svg" alt="ChatGPT Logo" className="w-16 h-16" />
          </div>
        </CardContent>
        <CardFooter className="mt-4 justify-center">
          <div className="flex items-center space-x-2 ">
            <Checkbox
              id="chatGPTCheckbox" disabled={true}/>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ChatGPT Integration</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-4">
              <ChatGPTForm 
                register={register} 
                errors={formErrors} 
                setErrors={setFormErrors}
              />
            </div>
            {formErrors.apiError && (
              <p className="text-red-500 text-sm mt-1">{formErrors.apiError.message}</p>
            )}
            <div className="mt-4 flex justify-end">
              <Button type="submit">
                Activate ChatGPT
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatGPTIntegration;