import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Clock, Calendar, FileText, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      gender: '',
      dob: '',
      address: ''
    }
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser(user);
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
            throw error;
          }
          
          if (data) {
            setProfile(data);
            form.reset({
              full_name: data.full_name || '',
              email: user.email || '',
              phone: data.phone || '',
              gender: data.gender || '',
              dob: data.dob || '',
              address: data.address || ''
            });
          } else {
            form.reset({
              full_name: '',
              email: user.email || '',
              phone: '',
              gender: '',
              dob: '',
              address: ''
            });
          }
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load profile information.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
        } else if (!session) {
          navigate('/auth');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          gender: formData.gender,
          dob: formData.dob,
          address: formData.address,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setProfile({
        ...profile,
        ...formData,
        updated_at: new Date().toISOString()
      });
      
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile information.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    form.reset({
      full_name: profile?.full_name || '',
      email: user?.email || '',
      phone: profile?.phone || '',
      gender: profile?.gender || '',
      dob: profile?.dob || '',
      address: profile?.address || ''
    });
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

  if (loading) {
    return (
      <div className="py-12 px-4 flex justify-center items-center min-h-[60vh]">
        <p>Loading profile information...</p>
      </div>
    );
  }

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
                      <h2 className="text-xl font-semibold">{profile?.full_name || user?.email}</h2>
                      <p className="text-gray-600 mb-6">{user?.email}</p>
                      <div className="flex flex-col w-full gap-2">
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full text-red-500 hover:text-red-600" 
                          onClick={handleSignOut}
                        >
                          Sign Out
                        </Button>
                      </div>
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
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="full_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input {...field} disabled />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="gender"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Gender</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="dob"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date of Birth</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end space-x-4 mt-6">
                            <Button type="button" variant="outline" onClick={handleCancel}>
                              Cancel
                            </Button>
                            <Button type="submit" className="bg-patho-primary hover:bg-patho-secondary">
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </Form>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <User className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">{profile?.full_name || 'Not set'}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="font-medium">{user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-medium">{profile?.phone || 'Not set'}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Date of Birth & Gender</p>
                            <p className="font-medium">
                              {profile?.dob ? new Date(profile.dob).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 'Not set'} • {profile?.gender || 'Not set'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">{profile?.address || 'Not set'}</p>
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
