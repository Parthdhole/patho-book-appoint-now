
import React, { useState } from 'react';
import { Building2, BarChart3, Users, Microscope, Banknote, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from "@/components/ui/use-toast";

const PartnerWithUs = () => {
  const [formData, setFormData] = useState({
    labName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    certifications: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Partner application submitted:', formData);
    
    // Show success message
    toast({
      title: "Application Submitted",
      description: "We've received your application and will contact you shortly.",
    });
    
    // Reset form
    setFormData({
      labName: '',
      ownerName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      certifications: '',
      message: ''
    });
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Partner With Dr. Patho</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our network of trusted diagnostic partners and grow your business while providing quality healthcare.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Why Partner With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard 
              icon={<Users className="h-10 w-10 text-patho-primary" />}
              title="Increased Patient Flow"
              description="Get access to our large customer base and increase your lab's visibility and bookings."
            />
            <BenefitCard 
              icon={<BarChart3 className="h-10 w-10 text-patho-primary" />}
              title="Business Growth"
              description="Grow your business with our digital platform and marketing strategies."
            />
            <BenefitCard 
              icon={<Banknote className="h-10 w-10 text-patho-primary" />}
              title="Better Revenue"
              description="Increase your revenue with optimized pricing and higher volume of tests."
            />
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <StepCard 
                number="1"
                title="Apply"
                description="Fill out the partnership application form with details about your lab."
              />
              <StepCard 
                number="2"
                title="Verification"
                description="Our team will verify your lab's credentials, certifications, and facilities."
              />
              <StepCard 
                number="3"
                title="Onboarding"
                description="Complete the onboarding process and get trained on our systems."
              />
              <StepCard 
                number="4"
                title="Go Live"
                description="Start receiving bookings and serving patients through our platform."
              />
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Partnership Requirements</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="bg-patho-light p-2 rounded-full mr-4">
                    <Building2 className="h-6 w-6 text-patho-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Established Lab</h3>
                    <p className="text-gray-600 text-sm">
                      Your lab should be operational for at least 1 year
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-patho-light p-2 rounded-full mr-4">
                    <Microscope className="h-6 w-6 text-patho-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Quality Standards</h3>
                    <p className="text-gray-600 text-sm">
                      NABL, ISO, or other relevant certifications preferred
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-patho-light p-2 rounded-full mr-4">
                    <Users className="h-6 w-6 text-patho-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Qualified Staff</h3>
                    <p className="text-gray-600 text-sm">
                      Trained technicians and pathologists on staff
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-patho-light p-2 rounded-full mr-4">
                    <BarChart3 className="h-6 w-6 text-patho-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Digital Readiness</h3>
                    <p className="text-gray-600 text-sm">
                      Basic computer systems and internet connectivity
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Form */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Apply to Become a Partner</h2>
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="labName">Lab Name *</Label>
                  <Input 
                    id="labName" 
                    name="labName"
                    value={formData.labName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner/Director Name *</Label>
                  <Input 
                    id="ownerName" 
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
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
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Lab Address *</Label>
                  <Input 
                    id="address" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input 
                    id="city" 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications (if any)</Label>
                  <Input 
                    id="certifications" 
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    placeholder="e.g., NABL, ISO 15189"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="message">Additional Information</Label>
                  <Textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your lab, services offered, etc."
                    className="h-32"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-patho-primary hover:bg-patho-secondary">
                Submit Application
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Benefit Card Component
const BenefitCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Step Card Component
const StepCard = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <div className="flex items-start">
    <div className="h-10 w-10 bg-patho-primary text-white rounded-full flex items-center justify-center text-lg font-bold shrink-0 mr-4">
      {number}
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex-grow">
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default PartnerWithUs;
