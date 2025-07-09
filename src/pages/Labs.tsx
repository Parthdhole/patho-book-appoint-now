import React, { useState } from 'react';
import { MapPin, Search, HomeIcon, Building2, Star, Filter, List, Grid3X3, MapPinned } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation, useNavigate } from 'react-router-dom';
import LocationDetector from '@/components/LocationDetector';

// Mock data for labs
const mockLabs = [
  {
    id: 1,
    name: "1MG Diagnostics",
    address: "Aundh, Pune, Maharashtra 411017",
    distance: "1.2 km",
    rating: "4.8",
    reviews: "324",
    hours: "7:00 AM - 9:00 PM",
    badges: ["NABL Certified", "ISO Certified", "Home Collection"],
    startingPrice: "₹499",
    image: "public/lovable-uploads/45e5178e-74bd-477f-a084-7e02310bb15a.png"
  },
  {
    id: 2,
    name: "Healthians",
    address: "Baner, Pune, Maharashtra 411045",
    distance: "2.5 km",
    rating: "4.7",
    reviews: "216",
    hours: "8:00 AM - 8:00 PM",
    badges: ["NABL Certified", "Home Collection"],
    startingPrice: "₹599",
    image: "public/lovable-uploads/45e5178e-74bd-477f-a084-7e02310bb15a.png"
  },
  {
    id: 3,
    name: "Apollo Diagnostics",
    address: "Kothrud, Pune, Maharashtra 411038",
    distance: "3.7 km",
    rating: "4.6",
    reviews: "198",
    hours: "7:30 AM - 8:30 PM",
    badges: ["ISO Certified", "Home Collection"],
    startingPrice: "₹549",
    image: "public/lovable-uploads/45e5178e-74bd-477f-a084-7e02310bb15a.png"
  },
  {
    id: 4,
    name: "Thyrocare",
    address: "Shivaji Nagar, Pune, Maharashtra 411005",
    distance: "4.1 km",
    rating: "4.5",
    reviews: "172",
    hours: "8:00 AM - 7:00 PM",
    badges: ["NABL Certified", "ISO Certified"],
    startingPrice: "₹449",
    image: "public/lovable-uploads/45e5178e-74bd-477f-a084-7e02310bb15a.png"
  }
];

const Labs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialState = location.state || {};
  
  const [locationQuery, setLocationQuery] = useState(initialState.location || '');
  const [searchQuery, setSearchQuery] = useState(initialState.query || '');
  const [viewType, setViewType] = useState('list');
  const [sortBy, setSortBy] = useState('relevance');
  const [labs, setLabs] = useState(mockLabs);
  const [selectedLab, setSelectedLab] = useState<any | null>(null);

  const handleViewDetails = (labId: number) => {
    navigate(`/labs/${labId}`);
  };

  const handleSelectLab = (lab: any) => {
    setSelectedLab(lab);
  };

  const handleLocationDetected = (detectedLocation: string) => {
    setLocationQuery(detectedLocation);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Enter your location"
              className="pl-10"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
            <LocationDetector
              onLocationDetected={handleLocationDetected}
              className="absolute right-2 top-1.5"
            />
          </div>
          
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for tests"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button className="bg-patho-primary hover:bg-patho-secondary">
            Search
          </Button>
        </div>

        <div className="flex mt-4 space-x-4">
          <Button variant="outline" className="flex items-center gap-2">
            <HomeIcon className="h-4 w-4" />
            Home
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Lab
          </Button>
        </div>
      </div>

      {/* Results section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">
          Showing {labs.length} Labs for {searchQuery ? `"${searchQuery}"` : '"All Tests"'}
        </h1>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          
          <div className="flex border rounded-md overflow-hidden">
            <button 
              className={`p-2 ${viewType === 'list' ? 'bg-patho-light text-patho-primary' : 'bg-white text-gray-600'}`}
              onClick={() => setViewType('list')}
            >
              <List className="h-5 w-5" />
            </button>
            <button 
              className={`p-2 ${viewType === 'grid' ? 'bg-patho-light text-patho-primary' : 'bg-white text-gray-600'}`}
              onClick={() => setViewType('grid')}
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button 
              className={`p-2 ${viewType === 'map' ? 'bg-patho-light text-patho-primary' : 'bg-white text-gray-600'}`}
              onClick={() => setViewType('map')}
            >
              <MapPinned className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort:</span>
            <select 
              className="border rounded-md px-2 py-1 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="distance">Distance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lab list */}
      <div className="space-y-6">
        {labs.map((lab) => (
          <div key={lab.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <img 
                  src={lab.image || "https://via.placeholder.com/200"} 
                  alt={lab.name} 
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
              
              <div className="md:w-3/4">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">{lab.name}</h2>
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600 text-sm">{lab.address} • {lab.distance}</p>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex items-center text-yellow-400 mr-2">
                        <Star className="w-4 h-4 fill-current mr-1" />
                        <span className="font-bold">{lab.rating}</span>
                      </div>
                      <span className="text-gray-500 text-sm">({lab.reviews})</span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-gray-600 text-sm">{lab.hours}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {lab.badges.map((badge, index) => (
                        <span 
                          key={index} 
                          className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                            badge.includes("NABL") ? "bg-blue-100 text-blue-800" : 
                            badge.includes("ISO") ? "bg-purple-100 text-purple-800" : 
                            "bg-green-100 text-green-800"
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right mt-4 md:mt-0">
                    <p className="text-sm text-gray-500 mb-1">Starting from</p>
                    <p className="text-2xl font-bold text-patho-primary mb-4">{lab.startingPrice}</p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewDetails(lab.id)}
                  >
                    View Details
                  </Button>
                  <Button 
                    className="flex-1 bg-patho-primary hover:bg-patho-secondary"
                    onClick={() => handleSelectLab(lab)}
                  >
                    Select Lab
                  </Button>
                </div>
              </div>
            </div>
            {selectedLab && selectedLab.id === lab.id && (
              <div className="mt-4 p-4 border-t bg-gray-50 rounded">
                <h3 className="text-lg font-semibold mb-2">Lab Details</h3>
                <div>
                  <b>Name:</b> {selectedLab.name}<br />
                  <b>Address:</b> {selectedLab.address}<br />
                  <b>Phone:</b> {selectedLab.phone || "N/A"}<br />
                  <b>Rating:</b> {selectedLab.rating}<br />
                  <b>Hours:</b> {selectedLab.hours}<br />
                  <b>Description:</b> {selectedLab.description || "N/A"}<br />
                </div>
                <Button
                  className="mt-3 w-full bg-green-500 hover:bg-green-600"
                  onClick={() => navigate('/booking', { state: { labId: selectedLab.id } })}
                >
                  Proceed to Book
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Labs;
