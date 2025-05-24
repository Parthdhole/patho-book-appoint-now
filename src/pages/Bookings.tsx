
import React, { useState, useEffect } from 'react';
import { Search, FileText, Calendar, MoreHorizontal, Download, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useRealtimeBookings } from '@/hooks/useRealtimeBookings';
import { supabase } from "@/integrations/supabase/client";

// Mock data for bookings
const mockBookings = [
  {
    id: "PB23456789",
    testName: "Thyroid Profile",
    labName: "MediLab Advanced Testing",
    date: "Jun 20, 2025",
    time: "11:30 AM",
    status: "Confirmed",
    price: "₹749"
  },
  {
    id: "PB34567890",
    testName: "Lipid Profile",
    labName: "City Central Pathology",
    date: "Jun 22, 2025",
    time: "09:00 AM",
    status: "Pending",
    price: "₹599"
  },
  {
    id: "PB45678901",
    testName: "Complete Blood Count (CBC)",
    labName: "HealthTest Diagnostics",
    date: "Jun 15, 2025",
    time: "10:15 AM",
    status: "Completed",
    price: "₹399",
    reportUrl: "#"
  },
  {
    id: "PB56789012",
    testName: "Vitamin D Test",
    labName: "Apollo Diagnostics",
    date: "Jun 10, 2025",
    time: "08:30 AM",
    status: "Completed",
    price: "₹999",
    reportUrl: "#"
  }
];

const Bookings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);
  const { bookings, loading } = useRealtimeBookings(userId ?? undefined);

  // Fix attribute names to match Booking interface (camelCase)
  const tableBookings = !loading && bookings
    ? bookings.map((b) => ({
        id: b.id,
        testName: b.testName,
        labName: b.labName ?? "-",
        date: b.appointmentDate
          ? new Date(b.appointmentDate).toLocaleDateString()
          : "-",
        time: b.appointmentTime ?? "-",
        status:
          b.status === "pending"
            ? "Pending"
            : b.status === "confirmed"
            ? "Confirmed"
            : b.status === "completed"
            ? "Completed"
            : b.status === "cancelled"
            ? "Cancelled"
            : b.status,
        price: typeof (b as any).price !== "undefined" ? (b as any).price : "₹0",
        reportUrl: typeof (b as any).reportUrl !== "undefined" ? (b as any).reportUrl : null,
      }))
    : [];

  const upcomingBookings = tableBookings.filter(
    (booking) => booking.status === 'Confirmed' || booking.status === 'Pending'
  );
  const pastBookings = tableBookings.filter(
    (booking) => booking.status === 'Completed' || booking.status === 'Cancelled'
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUpcomingBookings = upcomingBookings.filter(booking => 
    booking.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.labName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPastBookings = pastBookings.filter(booking => 
    booking.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.labName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewBooking = (bookingId: string) => {
    // In a real app, this would navigate to a booking details page
    console.log(`Viewing booking: ${bookingId}`);
  };

  const handleDownloadInvoice = (bookingId: string) => {
    // In a real app, this would download a PDF invoice
    toast.success("Invoice downloaded successfully!");
  };

  const handleCancelBooking = (bookingId: string) => {
    // In a real app, this would make an API call to cancel the booking
    toast.success("Booking cancelled successfully!");
  };

  const handleRescheduleBooking = (bookingId: string) => {
    // In a real app, this would navigate to a rescheduling page
    console.log(`Rescheduling booking: ${bookingId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-gray-600">View and manage all your diagnostic test bookings</p>
        </div>
        <Button 
          className="bg-patho-primary hover:bg-patho-secondary"
          onClick={() => window.location.href = '/tests'}
        >
          Book New Test
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search by lab, test, or booking ID"
          className="pl-10"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      
      <Tabs defaultValue="upcoming" className="mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="upcoming" 
            onClick={() => setActiveTab('upcoming')}
            className="data-[state=active]:bg-patho-primary data-[state=active]:text-white"
          >
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger 
            value="past" 
            onClick={() => setActiveTab('past')}
            className="data-[state=active]:bg-patho-primary data-[state=active]:text-white"
          >
            Past ({pastBookings.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="m-0">
          {filteredUpcomingBookings.length > 0 ? (
            <BookingTable 
              bookings={filteredUpcomingBookings} 
              onView={handleViewBooking}
              onDownload={handleDownloadInvoice}
              onCancel={handleCancelBooking}
              onReschedule={handleRescheduleBooking}
              type="upcoming"
            />
          ) : (
            <EmptyState 
              message={
                searchQuery 
                  ? "No bookings match your search" 
                  : "You don't have any upcoming bookings"
              }
              actionLabel="Book a Test"
              actionHref="/tests"
            />
          )}
        </TabsContent>
        
        <TabsContent value="past" className="m-0">
          {filteredPastBookings.length > 0 ? (
            <BookingTable 
              bookings={filteredPastBookings} 
              onView={handleViewBooking}
              onDownload={handleDownloadInvoice}
              type="past"
            />
          ) : (
            <EmptyState 
              message={
                searchQuery 
                  ? "No bookings match your search" 
                  : "You don't have any past bookings"
              }
              actionLabel="Book a Test"
              actionHref="/tests"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface BookingTableProps {
  bookings: typeof mockBookings;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  type: 'upcoming' | 'past';
}

const BookingTable = ({ 
  bookings, 
  onView, 
  onDownload, 
  onCancel, 
  onReschedule,
  type
}: BookingTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Booking Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-patho-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{booking.testName}</div>
                    <div className="text-sm text-gray-500">{booking.labName}</div>
                    <div className="text-xs text-gray-400">ID: {booking.id}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-patho-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{booking.date}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {booking.time}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' : 
                    booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }
                `}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onView(booking.id)}
                  >
                    View
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onDownload(booking.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </DropdownMenuItem>
                      
                      {type === 'upcoming' && (
                        <>
                          {onReschedule && (
                            <DropdownMenuItem onClick={() => onReschedule(booking.id)}>
                              <Calendar className="h-4 w-4 mr-2" />
                              Reschedule
                            </DropdownMenuItem>
                          )}
                          
                          {onCancel && (
                            <DropdownMenuItem 
                              onClick={() => onCancel(booking.id)}
                              className="text-red-600"
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Cancel Booking
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                      
                      {type === 'past' && booking.status === 'Completed' && booking.reportUrl && (
                        <DropdownMenuItem onClick={() => window.open(booking.reportUrl, '_blank')}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface EmptyStateProps {
  message: string;
  actionLabel: string;
  actionHref: string;
}

const EmptyState = ({ message, actionLabel, actionHref }: EmptyStateProps) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow">
      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-500 mb-6">Your bookings will appear here once you book a test</p>
      <Button 
        className="bg-patho-primary hover:bg-patho-secondary"
        onClick={() => window.location.href = actionHref}
      >
        {actionLabel}
      </Button>
    </div>
  );
};

export default Bookings;
