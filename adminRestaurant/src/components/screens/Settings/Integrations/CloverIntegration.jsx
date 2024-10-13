import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import CloverForm from '../IntegrationForms/CloverForm';
import { Checkbox } from "@/components/ui/checkbox"; 

const CloverIntegration = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [cloverIntegration, setCloverIntegration] = useState(null);

  const fetchCloverIntegration = useCallback(async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const idToken = await user.getIdToken();
      const clientId = 1; // Replace with actual client ID logic

      const response = await axios.get(`http://127.0.0.1:4000/clover/integration`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      if (response.status === 200 && response.data.integration) {
        setCloverIntegration(response.data.integration);
      } else {
        setCloverIntegration(null);
      }
    } catch (error) {
      console.error('Error fetching Clover integration:', error);
      setCloverIntegration(null);
    }
  }, []);

  useEffect(() => {
    fetchCloverIntegration();
  }, [fetchCloverIntegration]);

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

      const response = await axios.post('http://127.0.0.1:4000/clover/integration', {
        clientId: data.clientId,
        apiKey: data.apiKey,
        integrationType: data.integrationType
      }, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });

      if (response.status === 200) {
        console.log('Clover integration saved successfully');
        setIsDialogOpen(false);
        fetchCloverIntegration();
      }
    } catch (error) {
      console.error('Error saving Clover integration:', error);
      setFormErrors({ apiError: { message: 'Failed to save Clover integration. Please try again.' } });
    }
  };

  return (
    <>
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleCardClick}
      >
        <CardHeader>
          <CardTitle className="text-center">Clover</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-4">
            <img src="https://cloverstatic.com/web/apps/cloverdotcom/release::v2.113.0-1862c6818b5c4/assets/media/clover-logo.5637c88fda21055b797e300e16140c95.svg" alt="Clover" className="w-48 h-16" data-testid="image" data-loading="lazy" />
          </div>
        </CardContent>
        <CardFooter className="mt-4 justify-center">
          <div className="flex items-center space-x-2 ">
            <Checkbox
              id="cloverCheckBox"
              disabled={true}
            />
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clover Integration</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-4">
              <CloverForm 
                register={register} 
                errors={formErrors} 
                setErrors={setFormErrors}
                defaultValues={cloverIntegration}
              />
            </div>
            {formErrors.apiError && (
              <p className="text-red-500 text-sm mt-1">{formErrors.apiError.message}</p>
            )}
            <div className="mt-4 flex justify-end">
              <Button type="submit">
                Activate Clover
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CloverIntegration;