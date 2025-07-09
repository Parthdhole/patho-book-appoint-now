
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Shield, Bell, Database, Mail } from "lucide-react";
import { toast } from "sonner";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "Lab Management System",
    contactEmail: "admin@labsystem.com",
    allowRegistration: true,
    requireEmailVerification: true,
    autoConfirmBookings: false,
    enableNotifications: true,
    maxBookingsPerDay: 50,
    businessHours: "9:00 AM - 6:00 PM",
    timezone: "UTC+5:30",
  });

  const handleSaveSettings = () => {
    // In a real app, this would save to database
    toast.success("Settings saved successfully");
  };

  const handleBackupDatabase = () => {
    toast.success("Database backup initiated. You will receive an email when complete.");
  };

  const handleSystemMaintenance = () => {
    toast.success("System maintenance mode enabled. Users will see a maintenance message.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h2 className="text-2xl font-bold">System Settings</h2>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="businessHours">Business Hours</Label>
              <Input
                id="businessHours"
                value={settings.businessHours}
                onChange={(e) => setSettings({...settings, businessHours: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={settings.timezone}
                onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow User Registration</Label>
              <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
            </div>
            <Switch
              checked={settings.allowRegistration}
              onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Require Email Verification</Label>
              <p className="text-sm text-muted-foreground">Users must verify email before accessing account</p>
            </div>
            <Switch
              checked={settings.requireEmailVerification}
              onCheckedChange={(checked) => setSettings({...settings, requireEmailVerification: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Booking Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Booking Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-Confirm Bookings</Label>
              <p className="text-sm text-muted-foreground">Automatically confirm new bookings</p>
            </div>
            <Switch
              checked={settings.autoConfirmBookings}
              onCheckedChange={(checked) => setSettings({...settings, autoConfirmBookings: checked})}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">Send email notifications for booking updates</p>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => setSettings({...settings, enableNotifications: checked})}
            />
          </div>
          
          <Separator />
          
          <div>
            <Label htmlFor="maxBookings">Max Bookings Per Day</Label>
            <Input
              id="maxBookings"
              type="number"
              value={settings.maxBookingsPerDay}
              onChange={(e) => setSettings({...settings, maxBookingsPerDay: parseInt(e.target.value)})}
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleBackupDatabase} variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Backup Database
            </Button>
            <Button onClick={handleSystemMaintenance} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Maintenance Mode
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Test Email System
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} size="lg">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
