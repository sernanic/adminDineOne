import React, { useState } from 'react';
import GeneralSettings from './GeneralSettings';
import UsersSettings from './UsersSettings';
import RestaurantsSettings from './restaurantSettings/index';
import IntegrationsSettings from './IntegrationsSettings';
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
            case 'users':
                return <UsersSettings />;
            case 'restaurants':
                return <RestaurantsSettings />;
            case 'integrations':
                return <IntegrationsSettings />;
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
                        { name: 'Users', id: 'users' },
                        { name: 'Restaurants', id: 'restaurants' },
                        { name: 'Integrations', id: 'integrations' },
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
