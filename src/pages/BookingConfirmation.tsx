
import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Download, Calendar, Clock, MapPin, User, Phone, Mail, Home, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useReactToPrint } from 'react-to-print';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  
  const bookingData = location.state || {
    bookingId: 'PB12345678',
    testName: 'Complete Blood Count (CBC)',
    labName: 'MediLab Advanced Testing',
    price: '₹399',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    address: '123 Main St, Mumbai',
    date: 'June 20, 2025',
    time: '10:00 AM',
    collectionType: 'home'
  };
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Dr_Patho_Booking_${bookingData.bookingId}`,
    onAfterPrint: () => toast.success('Booking details downloaded successfully!'),
  });
  
  const handleViewBookings = () => {
    navigate('/bookings');
  };
  
  const handleBookAnotherTest = () => {
    navigate('/tests');
  };

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
            <p className="text-lg font-bold">{bookingData.bookingId}</p>
            <p className="text-sm text-gray-500">Booking Date</p>
            <p className="text-sm">{new Date().toLocaleDateString()}</p>
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
                <p className="font-medium">{bookingData.testName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lab Name</p>
                <p className="font-medium">{bookingData.labName}</p>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-patho-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{bookingData.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-patho-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{bookingData.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                {bookingData.collectionType === 'home' ? (
                  <Home className="h-4 w-4 text-patho-primary mt-0.5" />
                ) : (
                  <Building2 className="h-4 w-4 text-patho-primary mt-0.5" />
                )}
                <div>
                  <p className="text-sm text-gray-500">Collection Type</p>
                  <p className="font-medium">
                    {bookingData.collectionType === 'home' ? 'Home Collection' : 'Visit Lab'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium text-patho-primary">{bookingData.price}</p>
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
                  <p className="font-medium">{bookingData.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-patho-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{bookingData.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-patho-primary mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{bookingData.email}</p>
                </div>
              </div>
              {bookingData.collectionType === 'home' && (
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
                <span>{bookingData.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Collection Charges</span>
                <span>{bookingData.collectionType === 'home' ? '₹50' : '₹0'}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total Amount Paid</span>
                <span className="text-patho-primary">
                  {bookingData.collectionType === 'home' 
                    ? `₹${parseInt(bookingData.price.replace('₹', '')) + 50}`
                    : bookingData.price}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Payment Status</span>
                <span className="text-green-600 font-medium">Paid</span>
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
