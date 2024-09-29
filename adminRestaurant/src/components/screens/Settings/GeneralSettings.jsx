import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
 const GeneralSettings = () => (
    <>
        <Card>
            <CardHeader>
                <CardTitle>Store Name</CardTitle>
                <CardDescription>Used to identify your store in the marketplace.</CardDescription>
            </CardHeader>
            <CardContent>
                <Input placeholder="Store Name" className="mb-4" />
                <Button>Save</Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Plugins Directory</CardTitle>
                <CardDescription>The directory within your project, in which your plugins are located.</CardDescription>
            </CardHeader>
            <CardContent>
                <Input defaultValue="/content/plugins" className="mb-4" />
                <div className="flex items-center space-x-2 mb-4">
                    <Checkbox id="allow-admin" />
                    <label htmlFor="allow-admin">Allow administrators to change the directory.</label>
                </div>
                <Button>Save</Button>
            </CardContent>
        </Card>
    </>
);
export default GeneralSettings;