'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    return (
        <div className="container mx-auto p-4 md:p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your account and notification settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notifications</h3>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="match-notifications">New Matches</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive a notification when you get a new match.
                                </p>
                            </div>
                            <Switch id="match-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="message-notifications">New Messages</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive a notification for new messages.
                                </p>
                            </div>
                            <Switch id="message-notifications" defaultChecked />
                        </div>
                    </div>
                     <div className="space-y-4">
                        <h3 className="text-lg font-medium">Account</h3>
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <h4 className="font-medium">Export Your Data</h4>
                                <p className="text-sm text-muted-foreground">
                                    Download a copy of your profile information.
                                </p>
                            </div>
                            <Button variant="outline">Export</Button>
                        </div>
                         <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                            <div>
                                <h4 className="font-medium text-destructive">Delete Account</h4>
                                <p className="text-sm text-muted-foreground">
                                   Permanently delete your account and all associated data.
                                </p>
                            </div>
                            <Button variant="destructive">Delete</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
