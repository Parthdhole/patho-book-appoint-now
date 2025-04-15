
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Clock, Calendar, FileText, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "@/components/ui/use-toast";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    gender: 'Male',
    dob: '1990-01-15',
    address: '123 Main St, Pune, Maharashtra 411001'
  });

  const [formData, setFormData] = useState(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  // Mock data for recent bookings and test history
  const recentBookings = [
    {
      id: 'BK123456',
      date: '2025-04-10',
      time: '10:30 AM',
      lab: 'MediLab Advanced Testing',
      test: 'Complete Blood Count (CBC)',
      status: 'Completed'
    },
    {
      id: 'BK123457',
      date: '2025-04-05',
      time: '09:00 AM',
      lab: 'City Central Pathology',
      test: 'Lipid Profile',
      status: 'Completed'
    }
  ];

  const testHistory = [
    {
      id: 'TR789012',
      date: '2025-04-10',
      test: 'Complete Blood Count (CBC)',
      lab: 'MediLab Advanced Testing',
      status: 'Normal'
    },
    {
      id: 'TR789013',
      date: '2025-04-05',
      test: 'Lipid Profile',
      lab: 'City Central Pathology',
      status: 'Abnormal'
    },
    {
      id: 'TR789014',
      date: '2025-03-20',
      test: 'Thyroid Profile',
      lab: 'HealthTest Diagnostics',
      status: 'Normal'
    }
  ];

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600">Manage your account information and view your test history</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="history">Test History</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full bg-patho-light flex items-center justify-center mb-4">
                        <User className="h-12 w-12 text-patho-primary" />
                      </div>
                      <h2 className="text-xl font-semibold">{profile.name}</h2>
                      <p className="text-gray-600 mb-6">{profile.email}</p>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Personal Information</span>
                      {!isEditing && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit2 className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                              id="email" 
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                              id="phone" 
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Input 
                              id="gender" 
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input 
                              id="dob" 
                              name="dob"
                              type="date"
                              value={formData.dob}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Input 
                              id="address" 
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                          <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-patho-primary hover:bg-patho-secondary">
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <User className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">{profile.name}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="font-medium">{profile.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-medium">{profile.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Date of Birth & Gender</p>
                            <p className="font-medium">
                              {new Date(profile.dob).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })} • {profile.gender}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">{profile.address}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {recentBookings.length > 0 ? (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div 
                        key={booking.id} 
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center mb-2">
                            <div className="bg-patho-light text-patho-primary text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                              {booking.status}
                            </div>
                            <span className="text-sm text-gray-500">Booking ID: {booking.id}</span>
                          </div>
                          <h3 className="font-semibold mb-1">{booking.test}</h3>
                          <p className="text-sm text-gray-600 mb-1">{booking.lab}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="mr-3">{booking.date}</span>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Download Report
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent bookings found.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => window.location.href = '/tests'}
                    >
                      Book a Test
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Test History</CardTitle>
              </CardHeader>
              <CardContent>
                {testHistory.length > 0 ? (
                  <div className="space-y-4">
                    {testHistory.map((record) => (
                      <div 
                        key={record.id} 
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center mb-2">
                            <div className={`text-xs font-medium px-2.5 py-0.5 rounded mr-2 ${
                              record.status === 'Normal' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {record.status}
                            </div>
                            <span className="text-sm text-gray-500">Report ID: {record.id}</span>
                          </div>
                          <h3 className="font-semibold mb-1">{record.test}</h3>
                          <p className="text-sm text-gray-600 mb-1">{record.lab}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{record.date}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View Report
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No test history found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
