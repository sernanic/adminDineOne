import React from 'react';
import ChatGPTIntegration from './Integrations/ChatGPTIntegration';
import CloverIntegration from './Integrations/CloverIntegration';
import ToastIntegration from './Integrations/ToastIntegration';
import SquareIntegration from './Integrations/SquareIntegration';

const IntegrationsSettings = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <ChatGPTIntegration />
      <CloverIntegration />
      <ToastIntegration />
      <SquareIntegration />
    </div>
  );
};

export default IntegrationsSettings;