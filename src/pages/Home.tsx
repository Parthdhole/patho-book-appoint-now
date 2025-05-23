import React, { useState } from 'react';
import { Search, MapPin, HomeIcon, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";

const Home = () => {
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sampleType, setSampleType] = useState('home'); // 'home' or 'lab'
  const navigate = useNavigate();
  
  const handleSearch = () => {
    navigate('/labs', { 
      state: { 
        location, 
        query: searchQuery,
        sampleType
      } 
    });
  };

  const detectLocation = () => {
    setLocation('Current Location');
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Find and Book the <span className="text-patho-primary">Best Pathology Labs</span> Near You
          </h1>
          <p className="text-md md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Compare prices, read reviews, and schedule diagnostic tests from top-rated labs with confidence
          </p>

          <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter location"
                  className="pl-9 h-10"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Button
                  variant="link"
                  size="sm"
                  className="absolute right-2 top-1.5 text-patho-primary text-xs"
                  onClick={detectLocation}
                >
                  Detect
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tests (e.g. Blood Test)"
                  className="pl-9 h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mb-3">
              <Button 
                variant={sampleType === 'home' ? 'default' : 'outline'} 
                className={`flex items-center gap-2 flex-1 ${sampleType === 'home' ? 'bg-patho-primary hover:bg-patho-secondary' : ''}`}
                onClick={() => setSampleType('home')}
              >
                <HomeIcon className="h-4 w-4" />
                At Home Sample Collection
              </Button>
              <Button 
                variant={sampleType === 'lab' ? 'default' : 'outline'} 
                className={`flex items-center gap-2 flex-1 ${sampleType === 'lab' ? 'bg-patho-primary hover:bg-patho-secondary' : ''}`}
                onClick={() => setSampleType('lab')}
              >
                <Building2 className="h-4 w-4" />
                Visit a Lab
              </Button>
            </div>

            <Button 
              onClick={handleSearch} 
              className="w-full bg-patho-primary hover:bg-patho-secondary"
            >
              Find Labs
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Tests Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Popular Diagnostic Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestCard 
              title="Complete Blood Count (CBC)"
              originalPrice="₹499"
              discountedPrice="₹399"
              description="Measures different components of blood including red cells, white cells, and platelets"
              category="Blood Tests"
            />
            <TestCard 
              title="Lipid Profile"
              originalPrice="₹799"
              discountedPrice="₹599"
              description="Measures cholesterol, triglycerides, and lipoproteins to assess heart disease risk"
              category="Blood Tests"
            />
            <TestCard 
              title="Thyroid Profile"
              originalPrice="₹899"
              discountedPrice="₹749"
              description="Measures T3, T4, and TSH levels to assess thyroid function"
              category="Hormone Tests"
            />
          </div>
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              className="border-patho-primary text-patho-primary hover:bg-patho-light"
              onClick={() => navigate('/tests')}
            >
              View All Tests
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Labs Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Top Rated Pathology Labs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LabCard 
              name="MediLab Advanced Testing"
              address="Aundh, Pune, Maharashtra 411017"
              distance="1.2 km"
              rating="4.8"
              reviews="324"
              badges={["NABL Certified", "ISO Certified", "Home Collection"]}
            />
            <LabCard 
              name="City Central Pathology"
              address="Baner, Pune, Maharashtra 411045"
              distance="2.5 km"
              rating="4.7"
              reviews="216"
              badges={["NABL Certified", "Home Collection"]}
            />
            <LabCard 
              name="HealthTest Diagnostics"
              address="Kothrud, Pune, Maharashtra 411038"
              distance="3.7 km"
              rating="4.6"
              reviews="198"
              badges={["ISO Certified", "Home Collection"]}
            />
          </div>
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              className="border-patho-primary text-patho-primary hover:bg-patho-light"
              onClick={() => navigate('/labs')}
            >
              View All Labs
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center">How It Works</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Book your diagnostic tests in 4 simple steps
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard 
              number="1"
              title="Search"
              description="Search for tests or labs in your location"
            />
            <StepCard 
              number="2"
              title="Compare"
              description="Compare prices and read reviews"
            />
            <StepCard 
              number="3"
              title="Book"
              description="Book your appointment online"
            />
            <StepCard 
              number="4"
              title="Test"
              description="Get tested at the lab or at home"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const TestCard = ({ 
  title, 
  originalPrice, 
  discountedPrice,
  description,
  category 
}: { 
  title: string; 
  originalPrice: string;
  discountedPrice: string;
  description: string;
  category: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{category}</span>
      {Math.random() > 0.5 && <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Popular</span>}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-4">{description}</p>
    
    <div className="flex items-center mb-4">
      <div className="flex items-center text-blue-800">
        <span className="text-gray-400 line-through text-sm mr-2">{originalPrice}</span>
        <span className="text-xl font-bold">{discountedPrice}</span>
      </div>
    </div>
    
    <Button className="w-full bg-patho-primary hover:bg-patho-secondary">Book Now</Button>
  </div>
);

const LabCard = ({
  name,
  address,
  distance,
  rating,
  reviews,
  badges,
}: {
  name: string;
  address: string;
  distance: string;
  rating: string;
  reviews: string;
  badges: string[];
}) => (
  <Card className="p-0 overflow-hidden shadow-md hover:shadow-lg border-2 border-blue-100 transition-all">
    <div className="bg-yellow-400 px-6 py-3">
      <h3 className="text-xl font-bold text-gray-900 uppercase">{name}</h3>
    </div>
    <div className="p-6">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 22 20">
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
        </svg>
        <span className="font-semibold text-lg">{rating}</span>
        <span className="text-gray-500 text-sm pl-1">({reviews} reviews)</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="block text-gray-700 text-sm">{address}</span>
        <span className="ml-auto block text-patho-primary font-semibold text-xs">{distance} away</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4 mt-2">
        {badges.map((badge, idx) => (
          <span
            key={idx}
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              badge.includes("NABL")
                ? "bg-blue-100 text-blue-900"
                : badge.includes("ISO")
                ? "bg-purple-100 text-purple-900"
                : "bg-green-100 text-green-900"
            }`}
          >
            {badge}
          </span>
        ))}
      </div>
      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1 border-blue-400 text-blue-700 font-semibold hover:bg-blue-100">
          View Lab
        </Button>
        <Button className="flex-1 bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-300">
          Book Now
        </Button>
      </div>
    </div>
  </Card>
);

const StepCard = ({ 
  number, 
  title, 
  description 
}: { 
  number: string; 
  title: string;
  description: string;
}) => (
  <div className="text-center">
    <div className="h-16 w-16 bg-patho-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;
