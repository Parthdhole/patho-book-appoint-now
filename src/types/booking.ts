
export interface BookingFormData {
  testId: number;
  testName: string;
  labId?: number; 
  labName?: string;
  appointmentDate: Date;
  appointmentTime: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  patientEmail: string;
  sampleType: 'home' | 'lab';
  address?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid';
  createdAt: Date;
}

export interface Booking extends BookingFormData {
  id: string;
  userId: string;
}
