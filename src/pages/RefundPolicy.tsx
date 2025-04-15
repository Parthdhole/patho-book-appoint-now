
import React from 'react';
import { Banknote, ShieldAlert, CalendarClock, CircleX, ArrowLeftRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RefundPolicy = () => {
  return (
    <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Refund Policy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We value your trust and strive to provide the best service. Here's our refund policy to ensure transparency.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Banknote className="h-6 w-6 mr-2 text-patho-primary" />
              General Refund Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p className="mb-4">
              At Dr. Patho, we are committed to providing high-quality diagnostic services. 
              If you're not satisfied with our services, we offer a 100% refund for eligible cases.
            </p>
            <p>
              All refund requests are processed within 5-7 business days after approval. The refund 
              will be credited back to the original payment method used for booking.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldAlert className="h-6 w-6 mr-2 text-patho-primary" />
                Eligible for Refund
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  Test not conducted due to lab issues
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  Phlebotomist didn't arrive for home collection
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  Double payment for the same booking
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full p-1 mr-2 mt-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  Booking canceled more than 24 hours in advance
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CircleX className="h-6 w-6 mr-2 text-patho-primary" />
                Not Eligible for Refund
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-red-100 text-red-800 rounded-full p-1 mr-2 mt-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  Customer not available during scheduled home collection
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 text-red-800 rounded-full p-1 mr-2 mt-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  Booking canceled less than 24 hours before appointment
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 text-red-800 rounded-full p-1 mr-2 mt-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  Test completed successfully
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 text-red-800 rounded-full p-1 mr-2 mt-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </span>
                  Wrong test booked by customer
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarClock className="h-6 w-6 mr-2 text-patho-primary" />
              Refund Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-700">
              <p>
                Refund requests will be processed according to the following timeline:
              </p>
              <div className="pl-4 border-l-2 border-patho-primary space-y-3">
                <div>
                  <h3 className="font-semibold">Request Submission</h3>
                  <p className="text-sm">
                    Submit your refund request through our app, website, or by calling customer support within 7 days of the scheduled appointment.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Review Process (1-2 business days)</h3>
                  <p className="text-sm">
                    Our team will review your request and may contact you for additional information if needed.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Approval/Rejection</h3>
                  <p className="text-sm">
                    You will receive an email notification about the status of your refund request.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Processing (5-7 business days)</h3>
                  <p className="text-sm">
                    Once approved, the refund will be processed to your original payment method.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowLeftRight className="h-6 w-6 mr-2 text-patho-primary" />
              How to Request a Refund
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              To request a refund, please use one of the following methods:
            </p>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold mb-1">1. Through the App</h3>
                <p className="text-sm text-gray-700">
                  Go to "My Bookings" section, select the booking, and click on "Request Refund"
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold mb-1">2. Through Website</h3>
                <p className="text-sm text-gray-700">
                  Log in to your account, navigate to "My Bookings", select the booking, and click on "Request Refund"
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold mb-1">3. Customer Support</h3>
                <p className="text-sm text-gray-700">
                  Contact our customer support at 1800-123-4567 or email at support@drpatho.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RefundPolicy;
