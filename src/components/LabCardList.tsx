
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

const badgeColors: Record<string, string> = {
  "NABL Certified": "bg-green-100 text-green-800",
  "ISO Certified": "bg-blue-100 text-blue-800",
  "CAP Certified": "bg-purple-100 text-purple-800",
  "Home Collection": "bg-yellow-100 text-yellow-800",
};

export default function LabCardList() {
  return (
    <div className="py-8 px-2">
      <h2 className="text-lg text-center mb-6 font-medium">Select a location to view available labs.</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {labs.map((lab, idx) => (
          <div
            key={lab.id}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col transition hover:shadow-lg"
          >
            <div className="flex gap-4 items-start">
              {/* Avatar or Number */}
              <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-semibold text-gray-500">
                {lab.id.length === 1
                  ? lab.id.toUpperCase()
                  : /^[A-Za-z]+$/.test(lab.name.charAt(0))
                  ? lab.name.charAt(0)
                  : idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 font-bold text-lg">
                  {lab.name}
                </div>
                <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-black">{lab.rating}</span>
                  <span>({lab.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span>{lab.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1 mb-2">
                  {lab.badges.map((badge) => (
                    <span
                      key={badge}
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeColors[badge] || "bg-gray-100 text-gray-800"}`}
                    >
                      <Check className="h-4 w-4 mr-1" /> {badge}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-1">
                  {lab.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`${
                        tag === "Visit Lab"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      } px-3 py-1 rounded-full text-xs font-semibold`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-2">
                  <span className="font-semibold text-sm">Tests Offered:</span>
                  <ul className="ml-4 mt-1 list-disc text-sm text-gray-700">
                    {lab.testsOffered.map((test) => (
                      <li key={test}>{test}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold" size="lg">
              View Lab
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
