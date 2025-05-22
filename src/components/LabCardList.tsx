
import React from "react";
import { Star, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const labs = [
  {
    id: "lal",
    name: "Dr. Lal PathLabs",
    location: "Delhi",
    rating: 4.9,
    reviews: 410,
    badges: ["NABL Certified", "ISO Certified"],
    tags: ["Visit Lab"],
    testsOffered: ["Thyroid Profile", "Liver Function Test", "CBC"],
  },
  {
    id: "1mg",
    name: "1MG Diagnostics",
    location: "Bangalore",
    rating: 4.8,
    reviews: 324,
    badges: ["NABL Certified", "ISO Certified", "Home Collection"],
    tags: ["At Home Sample Collection", "Visit Lab"],
    testsOffered: ["Blood Test", "Thyroid Profile", "Lipid Profile"],
  },
  {
    id: "thyrocare",
    name: "Thyrocare",
    location: "Bangalore",
    rating: 4.5,
    reviews: 278,
    badges: ["ISO Certified", "Home Collection"],
    tags: ["At Home Sample Collection", "Visit Lab"],
    testsOffered: ["Thyroid Profile", "Vitamin D Test"],
  },
  {
    id: "srl",
    name: "SRL Diagnostics",
    location: "Mumbai",
    rating: 4.7,
    reviews: 250,
    badges: ["NABL Certified", "Home Collection"],
    tags: ["At Home Sample Collection", "Visit Lab"],
    testsOffered: ["Blood Test", "Liver Function Test"],
  },
  {
    id: "healthians",
    name: "Healthians",
    location: "Bangalore",
    rating: 4.7,
    reviews: 216,
    badges: ["NABL Certified", "ISO Certified", "Home Collection"],
    tags: ["At Home Sample Collection", "Visit Lab"],
    testsOffered: ["Complete Blood Count", "Diabetes Test", "Liver Function Test"],
  },
  {
    id: "metropolis",
    name: "Metropolis Labs",
    location: "Mumbai",
    rating: 4.6,
    reviews: 189,
    badges: ["NABL Certified", "ISO Certified", "Home Collection"],
    tags: ["At Home Sample Collection", "Visit Lab"],
    testsOffered: ["Diabetes Test", "Lipid Profile", "CBC"],
  },
  {
    id: "pathkind",
    name: "Pathkind Labs",
    location: "Delhi",
    rating: 4.5,
    reviews: 182,
    badges: ["ISO Certified", "CAP Certified", "Home Collection"],
    tags: ["At Home Sample Collection", "Visit Lab"],
    testsOffered: ["Blood Test", "Vitamin D Test"],
  },
];

// Badge and Tag styles
const badgeColors: Record<string, string> = {
  "NABL Certified": "bg-green-50 text-green-700",
  "ISO Certified": "bg-blue-50 text-blue-700",
  "CAP Certified": "bg-purple-50 text-purple-700",
  "Home Collection": "bg-green-50 text-green-700"
};

const tagColors: Record<string, string> = {
  "Visit Lab": "bg-green-100 text-green-800",
  "At Home Sample Collection": "bg-blue-100 text-blue-800"
};

export default function LabCardList() {
  return (
    <div className="py-8 px-2 bg-gray-50">
      <h2 className="text-lg md:text-xl text-center mb-6 font-medium">Select a location to view available labs.</h2>
      {/* Horizontal scroll for mobile, grid for desktop */}
      <div className="flex space-x-6 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:space-x-0 md:gap-6 md:overflow-visible">
        {labs.map((lab, idx) => (
          <div
            key={lab.id}
            className="min-w-[330px] bg-white rounded-2xl border border-gray-200 p-6 shadow hover:shadow-md flex flex-col transition relative md:min-w-0"
            style={{ flex: '0 0 330px' }}
          >
            <div className="flex gap-4 items-start">
              {/* Avatar or Number */}
              <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-2xl font-semibold text-gray-500 shadow-inner select-none">
                {lab.id.length === 1
                  ? lab.id.toUpperCase()
                  : /^[A-Za-z]+$/.test(lab.name.charAt(0))
                  ? (idx === 0 ? "D" : lab.name.charAt(0))
                  : idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 font-bold text-lg">
                  {lab.name}
                </div>
                <div className="flex items-center gap-1 text-sm mt-1 text-gray-700">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-0.5" />
                  <span className="font-semibold text-black">{lab.rating}</span>
                  <span className="text-gray-600">({lab.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span>{lab.location}</span>
                </div>
                <div className="mt-2 mb-2 flex flex-col gap-1">
                  {/* Show badges with check icon */}
                  {lab.badges.map((badge) => (
                    <span
                      key={badge}
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeColors[badge] || "bg-gray-100 text-gray-800"}`}
                    >
                      <Check className="h-4 w-4 mr-1 text-green-500" /> {badge}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {lab.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${tagColors[tag] || "bg-gray-100 text-gray-800"}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-2 mb-0.5">
                  <span className="font-semibold text-sm">Tests Offered:</span>
                  <ul className="ml-4 mt-1 list-disc text-sm text-gray-700">
                    {lab.testsOffered.map((test) => (
                      <li key={test}>{test}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {/* Button */}
            <Button className="mt-8 w-full text-white font-bold bg-blue-600 hover:bg-blue-700 rounded-lg h-12 text-base">
              View Lab
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
