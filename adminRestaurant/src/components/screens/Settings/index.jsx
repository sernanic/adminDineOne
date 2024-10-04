import React, { useState } from 'react';
import GeneralSettings from './GeneralSettings';
import SecuritySettings from './SecuritySettings';
import IntegrationsSettings from './IntegrationsSettings';
import SupportSettings from './SupportSettings';
import OrganizationsSettings from './OrganizationsSettings';
import AdvancedSettings from './AdvancedSettings';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Settings = () => {
    const [selectedTab, setSelectedTab] = useState('general');

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const renderTabContent = () => {
        switch (selectedTab) {
            case 'general':
                return <GeneralSettings />;
            case 'security':
                return <SecuritySettings />;
            case 'integrations':
                return <IntegrationsSettings />;
            case 'support':
                return <SupportSettings />;
            case 'organizations':
                return <OrganizationsSettings />;
            case 'advanced':
                return <AdvancedSettings />;
            default:
                return <GeneralSettings />;
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="flex gap-10">
                <div className="w-1/4 pr-6">
                    <nav className="space-y-2">
                        {[
                            { name: 'General', id: 'general' },
                            { name: 'Security', id: 'security' },
                            { name: 'Integrations', id: 'integrations' },
                            { name: 'Support', id: 'support' },
                            { name: 'Organizations', id: 'organizations' },
                            { name: 'Advanced', id: 'advanced' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                className={`block text-left w-full ${
                                    selectedTab === item.id
                                        ? 'text-primary'
                                        : 'text-gray-500'
                                }`}
                                onClick={() => handleTabClick(item.id)}
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="w-3/4 space-y-6">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default Settings;