
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Info, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
  relatedType?: 'booking' | 'user' | 'lab' | 'test';
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const generateMockNotifications = (): Notification[] => {
    return [
      {
        id: "1",
        type: "warning",
        title: "Pending Bookings Alert",
        message: "You have 5 pending bookings that require attention",
        isRead: false,
        createdAt: new Date().toISOString(),
        relatedType: "booking"
      },
      {
        id: "2",
        type: "info",
        title: "New User Registration",
        message: "3 new users registered today",
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        relatedType: "user"
      },
      {
        id: "3",
        type: "success",
        title: "Lab Test Completed",
        message: "Blood test for John Doe has been completed",
        isRead: true,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        relatedType: "booking"
      },
      {
        id: "4",
        type: "error",
        title: "System Alert",
        message: "High server load detected - consider scaling",
        isRead: false,
        createdAt: new Date(Date.now() - 10800000).toISOString(),
      },
      {
        id: "5",
        type: "info",
        title: "Weekly Report Available",
        message: "Your weekly analytics report is ready for review",
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ];
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // For now, using mock data. In a real app, this would fetch from database
      const mockNotifications = generateMockNotifications();
      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    
    // Set up real-time subscription for new bookings
    const channel = supabase
      .channel("admin-notifications")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "bookings"
      }, (payload) => {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: "info",
          title: "New Booking Received",
          message: `New booking for ${payload.new.test_name}`,
          isRead: false,
          createdAt: new Date().toISOString(),
          relatedId: payload.new.id,
          relatedType: "booking"
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        toast.success("New booking received!");
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success("Notification deleted");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'error': return <X className="h-5 w-5 text-red-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'warning': return 'destructive';
      case 'error': return 'destructive';
      case 'success': return 'default';
      default: return 'secondary';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) return <div className="p-4">Loading notifications...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} unread</Badge>
          )}
        </div>
        <Button onClick={markAllAsRead} variant="outline">
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No notifications yet</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card key={notification.id} className={`${notification.isRead ? 'bg-gray-50' : 'bg-white border-l-4 border-l-blue-500'}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                          {notification.type}
                        </Badge>
                      </div>
                      <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
