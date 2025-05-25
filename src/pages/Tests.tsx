import React, { useState } from 'react';
import { Search, Filter, Clock, Droplet, CalendarClock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const mockTests = [
  {
    id: 1,
    name: "Complete Blood Count (CBC)",
    category: "Blood Tests",
    description: "Measures different components of blood including red cells, white cells, and platelets",
    originalPrice: "₹499",
    discountedPrice: "₹399",
    sampleType: "Blood",
    fasting: "8-10 hours",
    reportTime: "Same Day",
    isPopular: true
  },
  {
    id: 2,
    name: "Lipid Profile",
    category: "Blood Tests",
    description: "Measures cholesterol, triglycerides, and lipoproteins to assess heart disease risk",
    originalPrice: "₹799",
    discountedPrice: "₹599",
    sampleType: "Blood",
    fasting: "12 hours",
    reportTime: "Same Day",
    isPopular: true
  },
  {
    id: 3,
    name: "Thyroid Profile",
    category: "Hormone Tests",
    description: "Measures T3, T4, and TSH levels to assess thyroid function",
    originalPrice: "₹899",
    discountedPrice: "₹749",
    sampleType: "Blood",
    fasting: "Not required",
    reportTime: "Next Day",
    isPopular: false
  },
  {
    id: 4,
    name: "Vitamin D Test",
    category: "Vitamin Tests",
    description: "Measures the level of Vitamin D in your blood to check for deficiency",
    originalPrice: "₹1299",
    discountedPrice: "₹999",
    sampleType: "Blood",
    fasting: "Not required",
    reportTime: "Next Day",
    isPopular: false
  },
  {
    id: 5,
    name: "HbA1c (Glycated Hemoglobin)",
    category: "Diabetes Tests",
    description: "Measures average blood glucose levels over the past 2-3 months",
    originalPrice: "₹599",
    discountedPrice: "₹499",
    sampleType: "Blood",
    fasting: "Not required",
    reportTime: "Same Day",
    isPopular: true
  },
  {
    id: 6,
    name: "Liver Function Test (LFT)",
    category: "Organ Function Tests",
    description: "Measures various proteins, enzymes, and substances to assess liver function",
    originalPrice: "₹899",
    discountedPrice: "₹699",
    sampleType: "Blood",
    fasting: "8 hours",
    reportTime: "Same Day",
    isPopular: false
  },
  {
    id: 7,
    name: "Kidney Function Test (KFT)",
    category: "Organ Function Tests",
    description: "Measures blood urea, serum creatinine, and other substances to assess kidney function",
    originalPrice: "₹799",
    discountedPrice: "₹649",
    sampleType: "Blood",
    fasting: "8 hours",
    reportTime: "Same Day",
    isPopular: false
  },
  {
    id: 8,
    name: "COVID-19 RT-PCR Test",
    category: "Infection Tests",
    description: "Detects the presence of SARS-CoV-2 virus that causes COVID-19",
    originalPrice: "₹999",
    discountedPrice: "₹799",
    sampleType: "Nasal & Throat Swab",
    fasting: "Not required",
    reportTime: "24-48 hours",
    isPopular: true
  }
];

// Mock labs for selection
const mockLabs = [
  {
    id: 101,
    name: "City Lab Diagnostics",
    address: "123 Main Street, Mumbai",
    phone: "9000000001",
    rating: 4.5,
    timings: "Mon-Sat: 8am-8pm",
    description: "NABL Accredited Lab with 20+ years experience.",
  },
  {
    id: 102,
    name: "Health First Labs",
    address: "456 Park Avenue, Pune",
    phone: "9000000002",
    rating: 4.1,
    timings: "Mon-Sun: 7am-7pm",
    description: "Modern diagnostic facilities.",
  },
  {
    id: 103,
    name: "Apollo Diagnostic Centre",
    address: "789 High Road, Delhi",
    phone: "9000000003",
    rating: 4.8,
    timings: "Mon-Fri: 8am-8pm, Sat: 8am-4pm",
    description: "Trusted for accuracy & reliability.",
  },
];

const Tests = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Tests');
  const [sortBy, setSortBy] = useState('popular');
  const [filteredTests, setFilteredTests] = useState(mockTests);

  // For Select Lab dialog
  const [labSelectOpen, setLabSelectOpen] = useState(false);
  const [selectedTestForLab, setSelectedTestForLab] = useState(null);

  const categories = ['All Tests', 'Blood Tests', 'Hormone Tests', 'Vitamin Tests', 'Diabetes Tests', 'Organ Function Tests', 'Infection Tests'];

  const handleSearch = () => {
    const filtered = mockTests.filter(test => 
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      test.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTests(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All Tests') {
      setFilteredTests(mockTests);
    } else {
      const filtered = mockTests.filter(test => test.category === category);
      setFilteredTests(filtered);
    }
  };

  // On "Book Now", immediately navigate to the booking form for first (default) lab
  const handleBookNow = (test: any) => {
    const defaultLab = mockLabs[0];
    navigate('/booking', { 
      state: { 
        testId: test.id, 
        labId: defaultLab.id,
        labName: defaultLab.name,
        labAddress: defaultLab.address,
        labPhone: defaultLab.phone,
        labRating: defaultLab.rating,
        labTimings: defaultLab.timings,
        labDescription: defaultLab.description,
        testPrice: test.discountedPrice // Pass price as string with ₹ 
      } 
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Diagnostic Tests</h1>
        <p className="text-lg text-gray-600 mb-6">
          Browse and book from a wide range of diagnostic tests available at top-rated labs across India. Compare prices, read about test details, and find the right tests for your health needs.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for tests (e.g. CBC, Thyroid, Diabetes)"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div className="flex gap-4">
            <select 
              className="border rounded-md px-4 py-2"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <Button 
              className="bg-patho-primary hover:bg-patho-secondary"
              onClick={handleSearch}
            >
              Search Tests
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">Showing {filteredTests.length} Tests</p>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            All Prices
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort:</span>
            <select 
              className="border rounded-md px-2 py-1 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">popular</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="name_asc">Name: A-Z</option>
              <option value="name_desc">Name: Z-A</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <div 
            key={test.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded`}>
                {test.category}
              </span>
              {test.isPopular && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Popular
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-semibold mb-2">{test.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{test.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600 text-sm">
                <Droplet className="h-4 w-4 mr-2 text-patho-primary" />
                <span>Sample: {test.sampleType}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Clock className="h-4 w-4 mr-2 text-patho-primary" />
                <span>Fasting: {test.fasting}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <CalendarClock className="h-4 w-4 mr-2 text-patho-primary" />
                <span>Report: {test.reportTime}</span>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center text-blue-800">
                <span className="text-gray-400 line-through text-sm mr-2">{test.originalPrice}</span>
                <span className="text-xl font-bold">{test.discountedPrice}</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-patho-primary hover:bg-patho-secondary"
              onClick={() => handleBookNow(test)}
            >
              Book Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tests;
