
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
  price?: number;                // <-- Added price here
  // The following fields are for UI/context in the form but are NOT sent to DB
  labAddress?: string;
  labPhone?: string;
  labRating?: number;
  labDescription?: string;
  labTimings?: string;
}

export interface Booking extends BookingFormData {
  id: string;
  userId: string;
}
