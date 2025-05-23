
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Download, Calendar, Clock, MapPin, User, Phone, Mail, Home, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useReactToPrint } from 'react-to-print';
import { supabase } from '@/integrations/supabase/client';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const bookingId = location.state?.bookingId || null;

  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (bookingId) {
        setLoading(true);
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", bookingId)
          .maybeSingle();
        setBookingData(data);
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Dr_Patho_Booking_${bookingId}`,
    onAfterPrint: () => toast.success('Booking details downloaded successfully!'),
  });

  const handleViewBookings = () => {
    navigate('/bookings');
  };

  const handleBookAnotherTest = () => {
    navigate('/tests');
  };

  if (loading || !bookingData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="text-gray-500">Loading booking details...</span>
      </div>
    );
  }

  // Calculate total price
  const price = bookingData.price ?? "₹0";
  const collectionCharge = bookingData.sample_type === 'home' ? 50 : 0;
  const totalAmount = ((parseInt(bookingData.price?.replace("₹", "") || "0") || 0) + collectionCharge);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 max-w-lg">
          Your diagnostic test has been successfully booked. You will receive a confirmation email and SMS shortly.
        </p>
      </div>
      <div ref={printRef} className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-patho-primary text-white flex items-center justify-center text-xl font-bold">
                D
              </div>
              <span className="text-xl font-bold">Dr. Patho</span>
            </div>
            <p className="text-sm text-gray-500">Diagnostic Test Booking</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Booking ID</p>
            <p className="text-lg font-bold">{bookingData.id}</p>
            <p className="text-sm text-gray-500">Booking Date</p>
            <p className="text-sm">{new Date(bookingData.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <Card className="mb-6">
          <CardHeader className="bg-blue-50">
            <CardTitle>Test Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Test Name</p>
                <p className="font-medium">{bookingData.test_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lab Name</p>
                <p className="font-medium">{bookingData.lab_name ?? "N/A"}</p>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-patho-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{bookingData.appointment_date ? new Date(bookingData.appointment_date).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-patho-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{bookingData.appointment_time}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                {bookingData.sample_type === 'home' ? (
                  <Home className="h-4 w-4 text-patho-primary mt-0.5" />
                ) : (
                  <Building2 className="h-4 w-4 text-patho-primary mt-0.5" />
                )}
                <div>
                  <p className="text-sm text-gray-500">Collection Type</p>
                  <p className="font-medium">
                    {bookingData.sample_type === 'home' ? 'Home Collection' : 'Visit Lab'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium text-patho-primary">{bookingData.price ?? "₹0"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardHeader className="bg-blue-50">
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-patho-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{bookingData.patient_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-patho-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{bookingData.patient_phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-patho-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{bookingData.patient_email}</p>
                </div>
              </div>
              {bookingData.sample_type === 'home' && bookingData.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-patho-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{bookingData.address}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Test Cost</span>
                <span>{bookingData.price ?? "₹0"}</span>
              </div>
              <div className="flex justify-between">
                <span>Collection Charges</span>
                <span>{bookingData.sample_type === 'home' ? '₹50' : '₹0'}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total Amount Paid</span>
                <span className="text-patho-primary">
                  ₹{totalAmount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Payment Status</span>
                <span className="text-green-600 font-medium">{bookingData.payment_status === "paid" ? "Paid" : bookingData.payment_status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Payment Method</span>
                <span>Credit Card</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-600">
          <p>
            <strong>Note:</strong> Please arrive 15 minutes before your scheduled appointment time. Bring your booking ID and a valid photo ID for verification.
          </p>
          <p className="mt-2">
            For any assistance, please contact our support team at support@drpatho.com or call 1800-123-4567.
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2"
          onClick={handlePrint}
        >
          <Download className="h-4 w-4" />
          Download Booking Details
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2"
          onClick={handleViewBookings}
        >
          View My Bookings
        </Button>
        <Button 
          className="flex items-center justify-center gap-2 bg-patho-primary hover:bg-patho-secondary"
          onClick={handleBookAnotherTest}
        >
          Book Another Test
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
