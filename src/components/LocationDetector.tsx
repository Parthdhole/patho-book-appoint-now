
import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/hooks/useLocation';
import { useToast } from '@/components/ui/use-toast';

interface LocationDetectorProps {
  onLocationDetected: (location: string) => void;
  className?: string;
}

const LocationDetector = ({ onLocationDetected, className }: LocationDetectorProps) => {
  const { location, isLoading, error, getCurrentLocation } = useLocation();
  const { toast } = useToast();

  const handleDetectLocation = async () => {
    await getCurrentLocation();
    
    if (error) {
      toast({
        title: "Location Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    if (location) {
      const locationString = location.city 
        ? `${location.city}${location.state ? `, ${location.state}` : ''}`
        : 'Current Location';
      
      onLocationDetected(locationString);
      
      toast({
        title: "Location Detected",
        description: `Found your location: ${locationString}`,
      });
    }
  };

  return (
    <Button
      variant="link"
      size="sm"
      className={`text-patho-primary text-xs ${className}`}
      onClick={handleDetectLocation}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin mr-1" />
      ) : (
        <MapPin className="h-3 w-3 mr-1" />
      )}
      {isLoading ? 'Detecting...' : 'Detect Location'}
    </Button>
  );
};

export default LocationDetector;
