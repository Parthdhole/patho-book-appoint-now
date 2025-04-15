
export const mockTests = [
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
    isPopular: true
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
    isPopular: true
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
    isPopular: false
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
    isPopular: false
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
    isPopular: true
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
    isPopular: false
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
    isPopular: false
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
    isPopular: true
  }
];

export const mockLabs = [
  {
    id: 1,
    name: "MediLab Advanced Testing",
    address: "Aundh, Pune, Maharashtra 411017",
    distance: "1.2 km",
    rating: "4.8",
    reviews: "324",
    badges: ["NABL Certified", "ISO Certified", "Home Collection"]
  },
  {
    id: 2,
    name: "City Central Pathology",
    address: "Baner, Pune, Maharashtra 411045",
    distance: "2.5 km",
    rating: "4.7",
    reviews: "216",
    badges: ["NABL Certified", "Home Collection"]
  },
  {
    id: 3,
    name: "HealthTest Diagnostics",
    address: "Kothrud, Pune, Maharashtra 411038",
    distance: "3.7 km",
    rating: "4.6",
    reviews: "198",
    badges: ["ISO Certified", "Home Collection"]
  }
];
