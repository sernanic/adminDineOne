import React, { useState } from 'react';
import GeneralSettings from './GeneralSettings';
import SecuritySettings from './SecuritySettings';
import IntegrationsSettings from './IntegrationsSettings';
import SupportSettings from './SupportSettings';
import OrganizationsSettings from './OrganizationsSettings';
import AdvancedSettings from './AdvancedSettings';
import UsersSettings from './UsersSettings';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tabs, Tab } from "@nextui-org/react";


const Settings = () => {
    const [selectedTab, setSelectedTab] = useState('general');

    const handleSelectionChange = (key) => {
        setSelectedTab(key);
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
            case 'users':
                return <UsersSettings />;
            default:
                return <GeneralSettings />;
        }
    };

    return (
        <div className="container mx-auto px-4 mt-8">
            <div className="flex flex-wrap gap-4 mb-8">
                <Tabs
                    variant="underlined"
                    aria-label="Settings tabs"
                    selectedKey={selectedTab}
                    onSelectionChange={handleSelectionChange}
                >
                    {[
                        { name: 'General', id: 'general' },
                        { name: 'Security', id: 'security' },
                        { name: 'Integrations', id: 'integrations' },
                        { name: 'Support', id: 'support' },
                        { name: 'Organizations', id: 'organizations' },
                        { name: 'Advanced', id: 'advanced' },
                        { name: 'Users', id: 'users' },
                    ].map((item) => (
                        <Tab key={item.id} title={item.name} />
                    ))}
                </Tabs>
            </div>
            <div className="flex gap-10">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default Settings;
