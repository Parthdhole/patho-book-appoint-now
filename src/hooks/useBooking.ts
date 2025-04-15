
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingFormData } from '@/types/booking';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const createBooking = async (bookingData: BookingFormData) => {
    setIsLoading(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to book an appointment",
          variant: "destructive",
        });
        navigate('/auth', { state: { returnTo: '/booking' } });
        return null;
      }
      
      const userId = session.session.user.id;
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          { 
            ...bookingData,
            userId,
            createdAt: new Date().toISOString()
          }
        ])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Booking Successful",
        description: "Your appointment has been booked successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserBookings = async () => {
    setIsLoading(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user) {
        return [];
      }
      
      const userId = session.session.user.id;
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Failed to load bookings",
        description: "There was an error loading your bookings. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooking,
    getUserBookings,
    isLoading
  };
};
