
import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Droplet, CalendarClock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';

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
    isPopular: true,
    availableAt: [1, 2, 3] // Lab IDs where this test is available
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
    isPopular: true,
    availableAt: [1, 3]
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
    isPopular: false,
    availableAt: [1, 2]
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
    isPopular: false,
    availableAt: [2, 3]
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
    isPopular: true,
    availableAt: [1, 2, 3]
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
    isPopular: false,
    availableAt: [1, 3]
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
    isPopular: false,
    availableAt: [2, 3]
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
    isPopular: true,
    availableAt: [1, 2, 3]
  }
];

// Mock labs data with matching names from Labs page
const mockLabs = [
  {
    id: 1,
    name: "MedLab Diagnostics Centre",
    address: "Aundh, Pune, Maharashtra 411017",
    phone: "+91-9000000001",
    rating: 4.8,
    timings: "7:00 AM - 9:00 PM",
    description: "NABL Accredited Lab with 20+ years experience in diagnostic testing.",
  },
  {
    id: 2,
    name: "Prime Health Laboratory",
    address: "Baner, Pune, Maharashtra 411045",
    phone: "+91-9000000002",
    rating: 4.7,
    timings: "8:00 AM - 8:00 PM",
    description: "Modern diagnostic facilities with state-of-the-art equipment.",
  },
  {
    id: 3,
    name: "Apollo Diagnostic Center",
    address: "Kothrud, Pune, Maharashtra 411038",
    phone: "+91-9000000003",
    rating: 4.6,
    timings: "7:30 AM - 8:30 PM",
    description: "Trusted for accuracy & reliability with nationwide presence.",
  },
  {
    id: 4,
    name: "Thyrocare Technologies",
    address: "Shivaji Nagar, Pune, Maharashtra 411005",
    phone: "+91-9000000004",
    rating: 4.5,
    timings: "8:00 AM - 7:00 PM",
    description: "Affordable diagnostic solutions with quick results.",
  },
];

const Tests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Tests');
  const [sortBy, setSortBy] = useState('popular');
  const [filteredTests, setFilteredTests] = useState<any[]>([]);
  const [selectedLab, setSelectedLab] = useState<any>(null);
  const [showLabSelector, setShowLabSelector] = useState(false);

  const categories = ['All Tests', 'Blood Tests', 'Hormone Tests', 'Vitamin Tests', 'Diabetes Tests', 'Organ Function Tests', 'Infection Tests'];

  useEffect(() => {
    // Check if lab is selected from navigation state
    if (location.state?.selectedLab) {
      console.log('Lab selected from navigation:', location.state.selectedLab);
      setSelectedLab(location.state.selectedLab);
      filterTestsByLab(location.state.selectedLab.id);
    } else {
      // No lab selected, show lab selector
      setShowLabSelector(true);
    }
  }, [location.state]);

  const filterTestsByLab = (labId: number) => {
    console.log('Filtering tests for lab ID:', labId);
    const availableTests = mockTests.filter(test => test.availableAt.includes(labId));
    console.log('Available tests:', availableTests);
    setFilteredTests(availableTests);
  };

  const handleLabSelection = (lab: any) => {
    console.log('Lab selected:', lab);
    setSelectedLab(lab);
    setShowLabSelector(false);
    filterTestsByLab(lab.id);
  };

  const handleSearch = () => {
    if (!selectedLab) return;
    
    let filtered = mockTests.filter(test => 
      test.availableAt.includes(selectedLab.id) &&
      (test.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       test.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    if (selectedCategory !== 'All Tests') {
      filtered = filtered.filter(test => test.category === selectedCategory);
    }
    
    setFilteredTests(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (!selectedLab) return;
    
    let filtered = mockTests.filter(test => test.availableAt.includes(selectedLab.id));
    
    if (category !== 'All Tests') {
      filtered = filtered.filter(test => test.category === category);
    }
    setFilteredTests(filtered);
  };

  const handleBookNow = (test: any) => {
    if (!selectedLab) {
      setShowLabSelector(true);
      return;
    }
    
    console.log('Booking test:', test, 'with lab:', selectedLab);
    navigate('/booking', { 
      state: { 
        testId: test.id,
        testName: test.name,
        labId: selectedLab.id,
        labName: selectedLab.name,
        labAddress: selectedLab.address,
        labPhone: selectedLab.phone,
        labRating: selectedLab.rating,
        labTimings: selectedLab.timings,
        labDescription: selectedLab.description
      } 
    });
  };

  const handleSelectDifferentLab = () => {
    setShowLabSelector(true);
  };

  if (showLabSelector) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Select a Lab First</h1>
          <p className="text-lg text-gray-600 mb-6">
            Please select a lab to view available tests at that location.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockLabs.map((lab) => (
            <div 
              key={lab.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleLabSelection(lab)}
            >
              <h3 className="text-xl font-semibold mb-2">{lab.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{lab.address}</p>
              <p className="text-gray-600 text-sm mb-2">Phone: {lab.phone}</p>
              <p className="text-gray-600 text-sm mb-2">Rating: {lab.rating} ⭐</p>
              <p className="text-gray-600 text-sm mb-4">Hours: {lab.timings}</p>
              <Button className="w-full bg-patho-primary hover:bg-patho-secondary">
                Select This Lab
              </Button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/labs')}
          >
            Browse All Labs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {selectedLab && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-blue-900">Selected Lab: {selectedLab.name}</h2>
              <p className="text-blue-700 text-sm">{selectedLab.address}</p>
              <p className="text-blue-700 text-sm">Rating: {selectedLab.rating} ⭐ | {selectedLab.timings}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSelectDifferentLab}
            >
              Change Lab
            </Button>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Available Tests</h1>
        <p className="text-lg text-gray-600 mb-6">
          Browse tests available at {selectedLab?.name}. Compare prices and book the right tests for your health needs.
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
      
      {filteredTests.length === 0 && selectedLab && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tests available at {selectedLab.name} for your search criteria.</p>
          <Button 
            className="mt-4"
            onClick={handleSelectDifferentLab}
          >
            Select Different Lab
          </Button>
        </div>
      )}
    </div>
  );
};

export default Tests;
