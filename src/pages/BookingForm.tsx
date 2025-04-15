
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Check, 
  ArrowRight,
  Home as HomeIcon,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock test data
const mockTests = [
  {
    id: 1,
    name: "Complete Blood Count (CBC)",
    price: "₹399",
    lab: "MediLab Advanced Testing"
  },
  {
    id: 2,
    name: "Lipid Profile",
    price: "₹599",
    lab: "City Central Pathology"
  },
  {
    id: 3,
    name: "Thyroid Profile",
    price: "₹749",
    lab: "HealthTest Diagnostics"
  }
];

// Mock time slots
const mockTimeSlots = [
  "07:00 AM", "07:30 AM", "08:00 AM", "08:30 AM", 
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"
];

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { testId, labId } = location.state || {};
  
  // Get test details from mock data
  const selectedTest = mockTests.find(test => test.id === testId) || mockTests[0];
  
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date: undefined as Date | undefined,
    time: '',
    collectionType: 'home' as 'home' | 'lab',
    notes: ''
  });
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setFormData(prevData => ({
      ...prevData,
      date
    }));
  };
  
  const handleTimeChange = (time: string) => {
    setFormData(prevData => ({
      ...prevData,
      time
    }));
  };
  
  const handleCollectionTypeChange = (value: 'home' | 'lab') => {
    setFormData(prevData => ({
      ...prevData,
      collectionType: value
    }));
  };
  
  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleNextStep = () => {
    if (formStep === 1) {
      // Validate first step
      if (!formData.name || !formData.email || !formData.phone) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else if (formStep === 2) {
      // Validate second step
      if (!formData.date || !formData.time || (formData.collectionType === 'home' && !formData.address)) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    
    setFormStep(prevStep => prevStep + 1);
  };
  
  const handlePreviousStep = () => {
    setFormStep(prevStep => prevStep - 1);
  };
  
  const handleSubmitPayment = () => {
    // In a real app, we would process the payment with Razorpay here
    // For demo purposes, we'll just simulate a successful payment
    
    // Validate payment details
    if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiry || !paymentData.cvv) {
      toast.error("Please fill in all payment details");
      return;
    }
    
    // Create a booking ID
    const bookingId = `PB${Math.floor(10000000 + Math.random() * 90000000)}`;
    
    // Show success message
    toast.success("Booking successful! Your booking ID is " + bookingId);
    
    // Navigate to the booking confirmation page
    navigate('/booking-confirmation', { 
      state: { 
        bookingId,
        testName: selectedTest.name,
        labName: selectedTest.lab,
        price: selectedTest.price,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        date: formData.date ? format(formData.date, 'PPP') : '',
        time: formData.time,
        collectionType: formData.collectionType
      } 
    });
  };
  
  const isValidForm = () => {
    if (formStep === 1) {
      return formData.name && formData.email && formData.phone;
    } else if (formStep === 2) {
      return formData.date && formData.time && (formData.collectionType === 'lab' || (formData.collectionType === 'home' && formData.address));
    } else if (formStep === 3) {
      return paymentData.cardNumber && paymentData.cardName && paymentData.expiry && paymentData.cvv;
    }
    return false;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book Your Test</h1>
        <p className="text-gray-600">Complete the form below to book your diagnostic test</p>
      </div>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              formStep >= 1 ? 'bg-patho-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {formStep > 1 ? <Check className="h-5 w-5" /> : 1}
            </div>
            <span className="text-sm mt-2">Personal Details</span>
          </div>
          
          <div className={`flex-1 h-1 mx-4 ${
            formStep >= 2 ? 'bg-patho-primary' : 'bg-gray-200'
          }`} />
          
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              formStep >= 2 ? 'bg-patho-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {formStep > 2 ? <Check className="h-5 w-5" /> : 2}
            </div>
            <span className="text-sm mt-2">Appointment Details</span>
          </div>
          
          <div className={`flex-1 h-1 mx-4 ${
            formStep >= 3 ? 'bg-patho-primary' : 'bg-gray-200'
          }`} />
          
          <div className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              formStep >= 3 ? 'bg-patho-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <span className="text-sm mt-2">Payment</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {/* Test Information */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Test Information</h3>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-700"><strong>Test:</strong> {selectedTest.name}</p>
              <p className="text-gray-700"><strong>Lab:</strong> {selectedTest.lab}</p>
            </div>
            <div>
              <p className="text-xl font-bold text-patho-primary">{selectedTest.price}</p>
            </div>
          </div>
        </div>
        
        {/* Step 1: Personal Details */}
        {formStep === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    className="pl-10"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Appointment Details */}
        {formStep === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Select Date <span className="text-red-500">*</span></Label>
                <div className="mt-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.date}
                        onSelect={handleDateChange}
                        initialFocus
                        disabled={(date) => date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div>
                <Label htmlFor="time">Select Time <span className="text-red-500">*</span></Label>
                <div className="mt-1 grid grid-cols-4 gap-2">
                  {mockTimeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={formData.time === time ? "default" : "outline"}
                      className={cn(
                        "h-10",
                        formData.time === time ? "bg-patho-primary text-white" : ""
                      )}
                      onClick={() => handleTimeChange(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Collection Type <span className="text-red-500">*</span></Label>
                <RadioGroup
                  value={formData.collectionType}
                  onValueChange={(value) => handleCollectionTypeChange(value as 'home' | 'lab')}
                  className="flex space-x-4 mt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home" className="flex items-center gap-1 cursor-pointer">
                      <HomeIcon className="h-4 w-4" />
                      Home Collection
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lab" id="lab" />
                    <Label htmlFor="lab" className="flex items-center gap-1 cursor-pointer">
                      <Building2 className="h-4 w-4" />
                      Visit Lab
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {formData.collectionType === 'home' && (
                <div>
                  <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter your complete address"
                      className="pl-10 min-h-[100px]"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any special instructions or notes"
                  className="min-h-[100px]"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Payment */}
        {formStep === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            
            <div className="p-4 border border-green-200 bg-green-50 rounded-lg mb-6">
              <h3 className="font-medium text-green-800 mb-2">Appointment Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Test:</div>
                <div className="font-medium">{selectedTest.name}</div>
                
                <div className="text-gray-600">Lab:</div>
                <div className="font-medium">{selectedTest.lab}</div>
                
                <div className="text-gray-600">Date:</div>
                <div className="font-medium">{formData.date ? format(formData.date, "PPP") : ''}</div>
                
                <div className="text-gray-600">Time:</div>
                <div className="font-medium">{formData.time}</div>
                
                <div className="text-gray-600">Collection Type:</div>
                <div className="font-medium">
                  {formData.collectionType === 'home' ? 'Home Collection' : 'Visit Lab'}
                </div>
                
                <div className="text-gray-600">Price:</div>
                <div className="font-medium text-patho-primary">{selectedTest.price}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number <span className="text-red-500">*</span></Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={handlePaymentInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="cardName">Name on Card <span className="text-red-500">*</span></Label>
                <Input
                  id="cardName"
                  name="cardName"
                  placeholder="John Doe"
                  value={paymentData.cardName}
                  onChange={handlePaymentInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date <span className="text-red-500">*</span></Label>
                  <Input
                    id="expiry"
                    name="expiry"
                    placeholder="MM/YY"
                    value={paymentData.expiry}
                    onChange={handlePaymentInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="cvv">CVV <span className="text-red-500">*</span></Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={handlePaymentInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> This is a demo application. No actual payment will be processed.
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        {formStep > 1 ? (
          <Button 
            type="button" 
            variant="outline"
            onClick={handlePreviousStep}
          >
            Back
          </Button>
        ) : (
          <div></div>
        )}
        
        {formStep < 3 ? (
          <Button 
            type="button" 
            className="bg-patho-primary hover:bg-patho-secondary flex items-center"
            onClick={handleNextStep}
            disabled={!isValidForm()}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            type="button" 
            className="bg-patho-primary hover:bg-patho-secondary"
            onClick={handleSubmitPayment}
            disabled={!isValidForm()}
          >
            Complete Payment
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
