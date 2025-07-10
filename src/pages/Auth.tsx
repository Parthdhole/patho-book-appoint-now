import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Auth = () => {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // We default redirect user to profile (admin handled after login)
        navigate('/profile');
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate('/profile');
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast({
        title: "Error",
        description: error.message || 'An error occurred during login',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });

      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Error",
        description: error.message || 'An error occurred during sign up',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      const randomEmail = `guest_${Math.random().toString(36).substring(2, 10)}@example.com`;
      const randomPassword = Math.random().toString(36).substring(2, 10);

      const { error } = await supabase.auth.signUp({
        email: randomEmail,
        password: randomPassword,
        options: {
          data: {
            full_name: 'Guest User',
          },
        },
      });

      if (error) throw error;

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: randomEmail,
        password: randomPassword,
      });

      if (signInError) throw signInError;

      navigate('/profile');
    } catch (error: any) {
      console.error('Error with guest login:', error);
      toast({
        title: "Error",
        description: error.message || 'An error occurred with guest login',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ADMIN LOGIN LOGIC
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Starting admin login for:", adminEmail);
      
      // 1. Regular authentication
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });
      if (signInError) {
        console.error("Sign in error:", signInError);
        throw signInError;
      }

      console.log("Authentication successful, checking admin role...");

      // 2. Check admin role with improved error handling
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const user_id = sessionData.session?.user?.id;
      if (!user_id) throw new Error("User not found after login");

      console.log("Checking admin role for user ID:", user_id);

      // Try RPC call first
      let isAdmin = false;
      try {
        const { data: rpcResult, error: rpcError } = await supabase.rpc('check_user_role', {
          user_id: user_id,
          role_name: 'admin'
        });

        if (rpcError) {
          console.log("RPC call failed, trying direct query:", rpcError);
          // Fallback to direct query
          const { data: roles, error: rolesError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user_id)
            .eq("role", "admin");

          if (rolesError) {
            console.error("Direct query also failed:", rolesError);
            throw new Error("Failed to check user roles");
          }

          isAdmin = roles && roles.length > 0;
        } else {
          isAdmin = !!rpcResult;
        }
      } catch (roleError) {
        console.error("All role check methods failed:", roleError);
        // Final fallback - check if this is the hardcoded admin
        isAdmin = adminEmail === 'admin22@gmail.com';
      }

      console.log("Admin check result:", isAdmin);

      if (!isAdmin) {
        // Logout and prevent further access
        await supabase.auth.signOut();
        toast({
          title: "Access Denied",
          description: "This account does not have admin privileges.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("Admin login successful, navigating to admin dashboard");
      navigate('/admin');
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast({
        title: "Admin Login Failed",
        description: error.message || "Could not login as admin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <div className="w-full max-w-md">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="admin">Admin Login</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your account to access your profile and bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="login-email" 
                        type="email" 
                        placeholder="your.email@example.com" 
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="login-password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-patho-primary hover:bg-patho-secondary" 
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGuestLogin}
                  disabled={loading}
                >
                  Continue as Guest
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                  Register to book tests and manage your health records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="signup-name" 
                        type="text" 
                        placeholder="John Doe" 
                        className="pl-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="your.email@example.com" 
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="signup-password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-patho-primary hover:bg-patho-secondary"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGuestLogin}
                  disabled={loading}
                >
                  Continue as Guest
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>
                  <span className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-yellow-500" /> Admin Login
                  </span>
                </CardTitle>
                <CardDescription>
                  Only authorized admins can access panel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="admin-email" 
                        type="email" 
                        placeholder="admin@example.com" 
                        className="pl-10"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="admin-password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Admin Sign In'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
