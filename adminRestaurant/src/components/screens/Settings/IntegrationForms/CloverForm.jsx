import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CloverForm = ({ register, errors, setErrors, defaultValues }) => {
  const validateForm = (e) => {
    const value = e.target.value;
    console.log("defaultValues", defaultValues)
    if (!value) {
      setErrors({ apiKey: { message: "API Key is required" } });
    } else {
      setErrors({});
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="apiKey">API Key</Label>
        <Input 
          id="apiKey" 
          {...register("apiKey", { 
            required: "API Key is required",
            onBlur: validateForm
          })} 
          className={errors.apiKey ? "border-red-500" : ""}
          defaultValue={defaultValues?.apiKey || ''}
        />
        {errors.apiKey && <p className="text-red-500 text-sm mt-1">{errors.apiKey.message}</p>}
      </div>
      <Input 
        type="hidden" 
        {...register("clientId")} 
        value={defaultValues?.clientId || "1"}
      />
      <Input 
        type="hidden" 
        {...register("integrationType")} 
        value="2"
      />
    </div>
  );
};

export default CloverForm;