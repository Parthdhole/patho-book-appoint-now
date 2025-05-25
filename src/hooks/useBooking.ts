
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingFormData, Booking } from '@/types/booking';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

function mapBookingRow(row: any): Booking {
  return {
    id: row.id,
    userId: row.user_id,
    testId: row.test_id,
    testName: row.test_name,
    labId: row.lab_id ?? undefined,
    labName: row.lab_name ?? undefined,
    appointmentDate: new Date(row.appointment_date),
    appointmentTime: row.appointment_time,
    patientName: row.patient_name,
    patientAge: row.patient_age,
    patientGender: row.patient_gender,
    patientPhone: row.patient_phone,
    patientEmail: row.patient_email,
    sampleType: row.sample_type,
    address: row.address ?? undefined,
    status: row.status,
    paymentStatus: row.payment_status,
    createdAt: new Date(row.created_at),
    price: row.price ?? undefined, // ensure price is read in
    // Optionally include contextual lab details if present for UI
    labAddress: row.lab_address ?? undefined,
    labPhone: row.lab_phone ?? undefined,
    labRating: row.lab_rating ?? undefined,
    labDescription: row.lab_description ?? undefined,
    labTimings: row.lab_timings ?? undefined,
  }
}

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

      const appointmentDate = (bookingData.appointmentDate instanceof Date)
        ? bookingData.appointmentDate.toISOString()
        : bookingData.appointmentDate;

      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          user_id: userId,
          test_id: bookingData.testId,
          test_name: bookingData.testName,
          lab_id: bookingData.labId ?? null,
          lab_name: bookingData.labName ?? null,
          appointment_date: appointmentDate,
          appointment_time: bookingData.appointmentTime,
          patient_name: bookingData.patientName,
          patient_age: bookingData.patientAge,
          patient_gender: bookingData.patientGender,
          patient_phone: bookingData.patientPhone,
          patient_email: bookingData.patientEmail,
          sample_type: bookingData.sampleType,
          address: bookingData.address ?? null,
          status: bookingData.status,
          payment_status: bookingData.paymentStatus,
          created_at: new Date().toISOString(),
          price: bookingData.price ?? null,  // <--- Add price for test
          // UI context fields NOT sent to DB: labAddress, labPhone, etc.
        }])
        .select()
        .maybeSingle();

      if (error) throw error;

      toast({
        title: "Booking Successful",
        description: "Your appointment has been booked successfully",
      });

      return data ? data : null;
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

  const getUserBookings = async (): Promise<Booking[]> => {
    setIsLoading(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) return [];

      const userId = session.session.user.id;

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as any[]).map(mapBookingRow) || [];
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
