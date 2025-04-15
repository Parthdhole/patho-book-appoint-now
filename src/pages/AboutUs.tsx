
import React from 'react';
import { CalendarCheck, Award, Clock, HeartPulse, Users, Building } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">About Dr. Patho</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Making quality healthcare accessible to everyone through innovative diagnostic solutions.
          </p>
        </div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-patho-light p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700">
              To provide accessible, affordable, and high-quality diagnostic services to help people
              lead healthier lives through early detection and preventive healthcare.
            </p>
          </div>
          <div className="bg-patho-light p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-700">
              To be the most trusted diagnostic service provider in the country, known for accuracy,
              reliability, and customer-centric approach.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Award className="h-10 w-10 text-patho-primary" />}
              title="Quality"
              description="We maintain the highest standards in our testing processes, equipment, and staff training."
            />
            <ValueCard 
              icon={<Clock className="h-10 w-10 text-patho-primary" />}
              title="Timeliness"
              description="We respect your time and ensure quick turnaround times for test results."
            />
            <ValueCard 
              icon={<HeartPulse className="h-10 w-10 text-patho-primary" />}
              title="Care"
              description="We treat every patient with empathy, dignity, and respect."
            />
            <ValueCard 
              icon={<Users className="h-10 w-10 text-patho-primary" />}
              title="Accessibility"
              description="We make healthcare accessible to all through affordable pricing and home collection services."
            />
            <ValueCard 
              icon={<Building className="h-10 w-10 text-patho-primary" />}
              title="Innovation"
              description="We continuously innovate our processes and technologies to improve patient experience."
            />
            <ValueCard 
              icon={<CalendarCheck className="h-10 w-10 text-patho-primary" />}
              title="Reliability"
              description="We deliver on our promises and maintain consistency in our services."
            />
          </div>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-6">Our Story</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-700 mb-4">
              Founded in 2015, Dr. Patho started with a simple mission: to make diagnostic healthcare accessible, 
              affordable, and convenient for everyone. What began as a single laboratory has now grown into a 
              network of over 2,500 partner labs across 500+ cities.
            </p>
            <p className="text-gray-700 mb-4">
              Our journey has been driven by a commitment to quality, innovation, and patient care. We were 
              among the first to introduce home sample collection services, making it easier for patients to 
              get tested without leaving their homes.
            </p>
            <p className="text-gray-700">
              Today, Dr. Patho serves over 1 million customers, offering a comprehensive range of diagnostic tests 
              with accurate results, competitive pricing, and exceptional service. We continue to expand our 
              services, embracing new technologies to enhance the patient experience and improve healthcare outcomes.
            </p>
          </div>
        </div>

        {/* Team Section - Can be added later if needed */}
      </div>
    </div>
  );
};

// ValueCard Component
const ValueCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default AboutUs;
