import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, HomeIcon, Building2, Clock, CreditCard, IndianRupee } from 'lucide-react';
import { useBooking } from '@/hooks/useBooking';
import { mockTests } from '@/data/mockData';
import { BookingFormData } from '@/types/booking';

const paymentOptions = [
  { value: 'pay_at_lab', label: 'Pay at Lab' },
  { value: 'pay_now_upi', label: 'Pay Now (UPI)' },
  { value: 'pay_now_card', label: 'Pay Now (Card)' },
];

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createBooking, isLoading } = useBooking();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sampleType, setSampleType] = useState<'home' | 'lab'>(
    (location.state?.sampleType as 'home' | 'lab') || 'home'
  );

  // Add price to the labInfo object (if present in route state)
  const selectedLab = location.state?.labId
    ? {
        labId: location.state.labId,
        labName: location.state.labName,
        labAddress: location.state.labAddress,
        labPhone: location.state.labPhone,
        labRating: location.state.labRating,
        labDescription: location.state.labDescription,
        labTimings: location.state.labTimings,
      }
    : null;

  const [testId, setTestId] = useState<number | null>(
    location.state?.testId || null
  );
  
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: 'male',
    patientPhone: '',
    patientEmail: '',
    appointmentTime: '09:00',
    address: '',
  });

  // Calculate the total price and test price
  const selectedTest = testId ? mockTests.find(test => test.id === testId) : null;
  const testCost = selectedTest ? (selectedTest.discountedPrice || selectedTest.originalPrice || '₹0') : '₹0';
  const collectionCharge = sampleType === 'home' ? 100 : 0;
  const totalPrice =
    '₹' +
    (parseInt((testCost as string).replace('₹', '')) + (collectionCharge || 0));

  // NEW: Payment method state
  const [paymentMethod, setPaymentMethod] = useState<string>('pay_at_lab');

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !testId || !selectedTest) {
      return;
    }
    
    // Parse the numeric price to store in booking
    const priceValue =
      typeof selectedTest.discountedPrice === 'string'
        ? parseInt(selectedTest.discountedPrice.replace('₹', '')) || 0
        : 0;
    
    const bookingData: BookingFormData = {
      testId,
      testName: selectedTest.name,
      labId: selectedLab?.labId,
      labName: selectedLab?.labName,
      labAddress: selectedLab?.labAddress,
      labPhone: selectedLab?.labPhone,
      labRating: selectedLab?.labRating,
      labDescription: selectedLab?.labDescription,
      labTimings: selectedLab?.labTimings,
      appointmentDate: selectedDate,
      appointmentTime: formData.appointmentTime,
      patientName: formData.patientName,
      patientAge: parseInt(formData.patientAge),
      patientGender: formData.patientGender,
      patientPhone: formData.patientPhone,
      patientEmail: formData.patientEmail,
      sampleType,
      address: sampleType === 'home' ? formData.address : undefined,
      status: 'pending',
      paymentStatus: paymentMethod === 'pay_at_lab' ? 'pending' : 'paid',
      price: priceValue,
      createdAt: new Date()
    };
    
    const result = await createBooking(bookingData);
    
    if (result) {
      // Pass payment info for confirmation/receipt if needed
      navigate('/booking-confirmation', {
        state: {
          bookingId: result.id,
          paymentMethod,
          price: priceValue, // pass price to confirmation
        },
      });
    }
  };
  
  useEffect(() => {
    if (!testId) {
      navigate('/tests');
    }
  }, [testId, navigate]);
  
  if (!selectedTest) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Book Appointment</h1>
      <div className="mb-4">
        {selectedLab && (
          <Card className="mb-5 border-blue-300 bg-blue-50">
            <CardHeader>
              <CardTitle>Selected Lab</CardTitle>
              <CardDescription>{selectedLab.labName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Address:</strong> {selectedLab.labAddress || "-"} </div>
                <div><strong>Phone:</strong> {selectedLab.labPhone || "-"} </div>
                <div>
                  <strong>Rating:</strong> {selectedLab.labRating ?? "-"} ⭐
                </div>
                <div><strong>Hours:</strong> {selectedLab.labTimings || "-"}</div>
                <div className="text-blue-900">{selectedLab.labDescription || "-"}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Test Details</CardTitle>
                <CardDescription>Review the test you're booking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h3 className="font-semibold text-lg">{selectedTest.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{selectedTest.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center">
                      <span className="text-gray-400 line-through text-sm mr-2">{selectedTest.originalPrice}</span>
                      <span className="text-lg font-bold text-blue-800">{selectedTest.discountedPrice}</span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {selectedTest.category}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Sample Collection</CardTitle>
                <CardDescription>Choose how you want your sample collected</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={sampleType} 
                  onValueChange={(value) => setSampleType(value as 'home' | 'lab')}
                  className="flex flex-col space-y-3"
                >
                  <div className={`flex items-center space-x-2 border rounded-md p-4 ${sampleType === 'home' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home" className="flex items-center cursor-pointer">
                      <HomeIcon className="mr-2 h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Home Sample Collection</p>
                        <p className="text-sm text-gray-500">We'll send a phlebotomist to collect your sample</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className={`flex items-center space-x-2 border rounded-md p-4 ${sampleType === 'lab' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value="lab" id="lab" />
                    <Label htmlFor="lab" className="flex items-center cursor-pointer">
                      <Building2 className="mr-2 h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Visit a Lab</p>
                        <p className="text-sm text-gray-500">Go to the nearest lab for sample collection</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                
                {sampleType === 'home' && (
                  <div className="mt-4">
                    <Label htmlFor="address">Home Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your complete address"
                      className="mt-1"
                      required
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>Choose your preferred date and time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block">Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label htmlFor="appointmentTime" className="mb-2 block">Select Time</Label>
                    <Select 
                      value={formData.appointmentTime} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, appointmentTime: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select how you want to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value)}
                  className="flex flex-col space-y-3"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <RadioGroupItem value="pay_at_lab" id="pay_at_lab" />
                    <Label htmlFor="pay_at_lab" className="flex items-center cursor-pointer">
                      <IndianRupee className="mr-2 h-5 w-5 text-green-600" />
                      <span>Pay at Lab (Offline Payment)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <RadioGroupItem value="pay_now_upi" id="pay_now_upi" />
                    <Label htmlFor="pay_now_upi" className="flex items-center cursor-pointer">
                      <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                      <span>Pay Now (UPI)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <RadioGroupItem value="pay_now_card" id="pay_now_card" />
                    <Label htmlFor="pay_now_card" className="flex items-center cursor-pointer">
                      <CreditCard className="mr-2 h-5 w-5 text-blue-400" />
                      <span>Pay Now (Card)</span>
                    </Label>
                  </div>
                </RadioGroup>
                {paymentMethod.startsWith('pay_now') && (
                  <div className="text-xs text-blue-600 mt-2 ml-2">* Online payment is a demo, no real payment will be taken.</div>
                )}
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>Enter patient details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Full Name</Label>
                    <Input
                      id="patientName"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="patientAge">Age</Label>
                    <Input
                      id="patientAge"
                      name="patientAge"
                      type="number"
                      value={formData.patientAge}
                      onChange={handleInputChange}
                      placeholder="Enter age"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="patientGender">Gender</Label>
                    <Select 
                      value={formData.patientGender} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, patientGender: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="patientPhone">Phone Number</Label>
                    <Input
                      id="patientPhone"
                      name="patientPhone"
                      value={formData.patientPhone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="patientEmail">Email</Label>
                    <Input
                      id="patientEmail"
                      name="patientEmail"
                      type="email"
                      value={formData.patientEmail}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-patho-primary hover:bg-patho-secondary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Confirm Booking'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
        
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Test Price</span>
                  <span>{testCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Sample Collection {sampleType === 'home' ? '(Home)' : '(Lab)'}
                  </span>
                  <span>{sampleType === 'home' ? '₹100' : 'Free'}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-blue-800">{totalPrice}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
