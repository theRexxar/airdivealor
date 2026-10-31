// Dive course packages (from airdivealor.com/dive-courses) and detail content, generated from the
// Claude Design prototype data (alor-courses.js, alor-course-details.js).
// Requirements follow published SDI / TDI standards; confirm with the dive shop before publishing.
import type { Course, CourseDetails } from "./courses-types";

export const COURSES: Course[] = [
 {
  "id": "owd",
  "level": "Beginner",
  "name": "Open Water Diver",
  "price": "IDR 14,000,000",
  "stay": "6D/5N stay",
  "dives": "1 pool, 8 dives",
  "img": "https://airdivealor.com/files/large/275/500/350",
  "text": "Your door to scuba diving. When you finish, you can dive to 18 m without direct supervision and join Advanced or Specialty courses.",
  "incl": [
   "SDI Open Water Diver certificate",
   "e-Learning module",
   "Accommodation",
   "3 meals: breakfast, lunch, dinner",
   "Scuba equipment",
   "Airport transfer (return)",
   "Marine park fee"
  ]
 },
 {
  "id": "aad",
  "level": "Advanced",
  "name": "Advanced Adventure Diver",
  "price": "IDR 15,150,000",
  "stay": "6D/5N stay",
  "dives": "8 dives",
  "img": "https://airdivealor.com/files/large/264/500/350",
  "text": "Take your basics to the next level and dive to 30 m. Deep and Navigation dives are required, and you pick three more adventure dives.",
  "incl": [
   "SDI Advanced Adventure Diver certificate",
   "e-Learning module",
   "Accommodation",
   "3 meals: breakfast, lunch, dinner",
   "Scuba equipment",
   "Airport transfer (return)",
   "Marine park fee"
  ]
 },
 {
  "id": "adv4",
  "level": "Advanced",
  "name": "Advanced with 4 Specialties",
  "price": "IDR 19,800,000",
  "stay": "7D/6N stay",
  "dives": "8 dives",
  "img": "https://airdivealor.com/files/large/267/500/350",
  "text": "The full Advanced program. A week of training in different environments, finishing with four specialties such as Deep, Night, Nitrox or Sidemount.",
  "incl": [
   "SDI Advanced certificate",
   "4 SDI specialty certificates",
   "e-Learning module",
   "Accommodation",
   "3 meals: breakfast, lunch, dinner",
   "Scuba equipment",
   "Airport transfer (return)",
   "Marine park fee"
  ]
 },
 {
  "id": "side",
  "level": "Specialty",
  "name": "Sidemount Specialty Diver",
  "price": "IDR 12,825,000",
  "stay": "5D/4N stay",
  "dives": "6 dives",
  "img": "https://airdivealor.com/files/large/277/500/350",
  "text": "\"Once you go side, you never go back.\" Two tanks on your sides feel more comfortable and safer, and can help divers with back pain.",
  "incl": [
   "SDI Sidemount Specialty certificate",
   "1 free extra dive",
   "e-Learning module",
   "Accommodation",
   "3 meals: breakfast, lunch, dinner",
   "Scuba equipment",
   "Airport transfer (return)",
   "Marine park fee"
  ]
 },
 {
  "id": "nitrox",
  "level": "Specialty",
  "name": "Computer Nitrox Diver",
  "price": "IDR 7,150,000",
  "stay": "4D/3N stay",
  "dives": "2 dives",
  "img": "https://airdivealor.com/files/large/273/500/350",
  "text": "Dive with enriched air up to 40% oxygen. Learn how Nitrox gives you longer bottom times and more no-decompression time on your computer.",
  "incl": [
   "SDI Computer Nitrox certificate",
   "1 free extra dive on air",
   "e-Learning module",
   "Accommodation",
   "3 meals: breakfast, lunch, dinner",
   "Scuba equipment",
   "Airport transfer (return)",
   "Marine park fee"
  ]
 },
 {
  "id": "deep",
  "level": "Specialty",
  "name": "Deep Specialty Diver",
  "price": "IDR 9,500,000",
  "stay": "4D/3N stay",
  "dives": "4 dives",
  "img": "https://airdivealor.com/files/large/276/500/350",
  "text": "Go safely to a maximum of 40 m, the deepest you can dive within no-decompression limits.",
  "incl": [
   "SDI Deep Specialty certificate",
   "e-Learning module",
   "Accommodation",
   "3 meals: breakfast, lunch, dinner",
   "Scuba equipment",
   "Airport transfer (return)",
   "Marine park fee"
  ]
 },
 {
  "id": "night",
  "level": "Specialty",
  "name": "Night & Low Visibility Diver",
  "price": "IDR 6,150,000",
  "stay": "4D/3N stay",
  "dives": "2 dives",
  "img": "https://airdivealor.com/files/large/271/500/350",
  "text": "Meet the animals that only come out at night. Learn to plan and run night dives safely with the right lights and gear.",
  "incl": [
   "SDI Night & Low Visibility certificate",
   "e-Learning module",
   "Accommodation",
   "3 meals: breakfast, lunch, dinner",
   "Scuba equipment",
   "Airport transfer (return)",
   "Marine park fee"
  ]
 },
 {
  "id": "rescue",
  "level": "Advanced",
  "name": "Rescue Diver",
  "price": "IDR 15,250,000",
  "stay": "6D/5N stay",
  "dives": "8 dives",
  "img": "https://airdivealor.com/files/large/266/500/350",
  "text": "Build the knowledge and skills to help and rescue other divers, and give first aid when it matters.",
  "incl": [
   "SDI Rescue Diver certificate",
   "e-Learning module",
   "Accommodation",
   "3 meals: breakfast, lunch, dinner",
   "Scuba equipment",
   "Airport transfer (return)",
   "Marine park fee"
  ]
 },
 {
  "id": "msd",
  "level": "Professional",
  "name": "Master Scuba Diver",
  "price": "IDR 27,500,000",
  "stay": "15D/14N stay",
  "dives": "Unlimited dives",
  "img": "https://airdivealor.com/files/large/272/500/350",
  "text": "The top level of recreational diving. Needs at least 50 logged dives and 4 specialties, and is a respected title in the diving community.",
  "incl": [
   "SDI Master Scuba Diver certificate",
   "1 free extra dive",
   "Accommodation",
   "3 meals: breakfast, lunch, dinner",
   "Scuba equipment",
   "Airport transfer (return)",
   "Marine park fee"
  ]
 },
 {
  "id": "dm",
  "level": "Professional",
  "name": "SDI Divemaster",
  "price": "IDR 30,000,000",
  "stay": "15D/14N stay",
  "dives": "Unlimited dives",
  "img": "https://airdivealor.com/files/large/268/500/350",
  "text": "Your first step to working in diving. Learn the skills to lead certified divers in open water.",
  "incl": [
   "SDI Divemaster certificate",
   "SDI Divemaster manuals",
   "e-Learning module",
   "Accommodation",
   "3 meals: breakfast, lunch, dinner",
   "Scuba equipment",
   "Airport transfer (return)",
   "Marine park fee"
  ]
 },
 {
  "id": "tdi",
  "level": "Technical",
  "name": "TDI Courses",
  "price": "On request",
  "stay": "Tailored to each course",
  "dives": "Technical diving",
  "img": "https://airdivealor.com/files/large/278/500/350",
  "text": "Technical diving with TDI, founded in 1994 by some of the most experienced instructors in diving. High standards, so you finish as a proud and capable tech diver.",
  "incl": [
   "TDI manuals and certificate",
   "Program planned with your instructor"
  ]
 },
 {
  "id": "custom",
  "level": "Custom",
  "name": "Custom Courses",
  "price": "Pay as you go",
  "stay": "Your dates",
  "dives": "Your choice",
  "img": "https://airdivealor.com/files/large/265/500/350",
  "text": "Mix a diver-level course with any specialty, or add new skills to your trip. Tell us what you want and we make it happen.",
  "incl": [
   "SDI manuals and certificate",
   "e-Learning module",
   "Accommodation",
   "3 meals: breakfast, lunch, dinner",
   "Scuba equipment",
   "Airport transfer (return)",
   "Marine park fee"
  ]
 }
];

export const DETAILS: CourseDetails = {
 "included": {
  "e-Learning module": [
   "laptop",
   "SDI online theory with videos and quizzes. Start at home before you fly, or finish it in the evenings at the resort. Your access never expires."
  ],
  "Accommodation": [
   "bed-double",
   "A deluxe room at the resort in Alor Kecil for every night of your package, a short walk from the boat."
  ],
  "3 meals: breakfast, lunch, dinner": [
   "utensils",
   "Breakfast before the boat leaves, lunch on board or at the resort, and a local dinner. Tell us about allergies when you book."
  ],
  "Scuba equipment": [
   "life-buoy",
   "BCD, regulator, dive computer, wetsuit, mask, fins, weights and tanks. Bring your own gear if you prefer."
  ],
  "Airport transfer (return)": [
   "plane",
   "Pick-up and drop-off at Mali Airport. The drive to Alor Kecil takes about 45 minutes."
  ],
  "Marine park fee": [
   "ticket",
   "The Alor marine park entry fee for every day you dive is already paid."
  ],
  "1 free extra dive": [
   "gift",
   "One extra fun dive after your course, so you can practise your new skills with a guide."
  ],
  "1 free extra dive on air": [
   "gift",
   "One extra fun dive on regular air after your course."
  ],
  "4 SDI specialty certificates": [
   "award",
   "Four specialty cards, for example Deep, Night, Nitrox or Sidemount. You choose them with your instructor."
  ],
  "SDI Divemaster manuals": [
   "book-open",
   "Printed and digital Divemaster manuals, slates and the SDI standards you will work with."
  ],
  "TDI manuals and certificate": [
   "award",
   "TDI course materials and a digital TDI certification card when you pass."
  ],
  "Program planned with your instructor": [
   "clipboard-list",
   "We plan gas, gear and dive days around your goals and current experience."
  ],
  "SDI manuals and certificate": [
   "award",
   "Course materials and the SDI card for every course in your custom plan."
  ]
 },
 "certDetail": "Digital SDI certification card, recognised worldwide, issued as soon as you pass.",
 "notIncluded": [
  "Flights to and from Alor",
  "Dive and travel insurance (required)",
  "Soft drinks, beer and snacks",
  "Crew tips (optional)"
 ],
 "courses": {
  "owd": {
   "days": "6 days",
   "dives": "1 pool + 8 dives",
   "depth": "18 m",
   "age": "10+ years",
   "prereq": "None. You must be able to swim 200 m and float for 10 minutes.",
   "group": "Max 4 students per instructor",
   "learn": [
    "Set up and check your scuba gear",
    "Clear your mask and recover your regulator",
    "Control your buoyancy and trim",
    "Share air with a buddy in an emergency",
    "Plan dives with a dive computer",
    "Make safe ascents and safety stops"
   ],
   "plan": [
    [
     "Day 1",
     "Arrival and theory",
     "Airport pick-up, check-in and a review of your e-Learning with your instructor."
    ],
    [
     "Day 2",
     "Pool session",
     "First breaths underwater and all the basic skills in shallow, calm water."
    ],
    [
     "Day 3 to 4",
     "Open water dives 1 to 4",
     "Repeat the skills in the sea at sheltered sites like Anemone City."
    ],
    [
     "Day 5",
     "Dives 5 to 8",
     "Fun dives to practise buoyancy and navigation. You finish certified."
    ],
    [
     "Day 6",
     "Departure",
     "No diving 24 hours before you fly. Transfer to Mali Airport."
    ]
   ],
   "tips": [
    "Start the e-Learning at home so you have more time in the water.",
    "Ears hurt? Equalise early and often. Your instructor will show you how.",
    "Under 15? You get a Junior Open Water card with a 12 m limit."
   ]
  },
  "aad": {
   "days": "6 days",
   "dives": "8 dives",
   "depth": "30 m",
   "age": "12+ years",
   "prereq": "SDI Open Water Diver or equivalent.",
   "group": "Max 4 students per instructor",
   "learn": [
    "Plan and make deep dives to 30 m",
    "Navigate with a compass and natural features",
    "Pick 3 more adventure dives, e.g. night, drift or wreck",
    "Improve your air use and buoyancy"
   ],
   "plan": [
    [
     "Day 1",
     "Arrival and briefing",
     "Check-in, gear fitting and course planning with your instructor."
    ],
    [
     "Day 2",
     "Deep and navigation",
     "The two required adventure dives."
    ],
    [
     "Day 3 to 4",
     "Your adventure dives",
     "Three dives you choose, matched to Alor sites and currents."
    ],
    [
     "Day 5",
     "Fun dives",
     "Use your new skills on Alor reefs. You finish certified."
    ],
    [
     "Day 6",
     "Departure",
     "No diving 24 hours before you fly."
    ]
   ],
   "tips": [
    "Drift diving in the Pantar Strait is a popular choice.",
    "Bring your logbook so we can see your experience."
   ]
  },
  "adv4": {
   "days": "7 days",
   "dives": "8 dives",
   "depth": "30 to 40 m",
   "age": "15+ years",
   "prereq": "SDI Open Water Diver or equivalent.",
   "group": "Max 4 students per instructor",
   "learn": [
    "Everything in the Advanced Adventure course",
    "Four full specialties, e.g. Deep, Night, Nitrox, Sidemount",
    "Dive in different environments: walls, muck, drift and night"
   ],
   "plan": [
    [
     "Day 1",
     "Arrival and planning",
     "Choose your four specialties with your instructor."
    ],
    [
     "Day 2 to 3",
     "Specialties 1 and 2",
     "Theory in the morning, dives in the afternoon."
    ],
    [
     "Day 4 to 5",
     "Specialties 3 and 4",
     "Including a night dive at the house reef."
    ],
    [
     "Day 6",
     "Fun dives",
     "Put it all together. You finish with 5 certification cards."
    ],
    [
     "Day 7",
     "Departure",
     "No diving 24 hours before you fly."
    ]
   ],
   "tips": [
    "Deep Specialty is needed to dive below 30 m.",
    "Choose Nitrox early: it gives you longer dives for the rest of the week."
   ]
  },
  "side": {
   "days": "5 days",
   "dives": "6 dives",
   "depth": "18 to 30 m",
   "age": "15+ years",
   "prereq": "SDI Open Water Diver or equivalent.",
   "group": "Max 2 students per instructor",
   "learn": [
    "Set up and trim a sidemount harness",
    "Breathe from and switch between two tanks",
    "Handle gas failures safely",
    "Enter and exit the water with two tanks"
   ],
   "plan": [
    [
     "Day 1",
     "Arrival and gear setup",
     "Fit and set up your sidemount harness on land."
    ],
    [
     "Day 2",
     "Shallow skills",
     "Trim, balance and switching tanks in calm water."
    ],
    [
     "Day 3 to 4",
     "Open water dives",
     "Full sidemount dives on Alor reefs. You finish certified."
    ],
    [
     "Day 5",
     "Departure",
     "Your extra free dive can be on any day before this."
    ]
   ],
   "tips": [
    "Sidemount takes weight off your back. Good if you have back pain.",
    "Sidemount harness rental is included."
   ]
  },
  "nitrox": {
   "days": "4 days",
   "dives": "2 dives",
   "depth": "Max 40 m (gas limit)",
   "age": "15+ years",
   "prereq": "SDI Open Water Diver or equivalent.",
   "group": "Max 4 students per instructor",
   "learn": [
    "Analyse your own tank of Nitrox",
    "Set your dive computer for Nitrox",
    "Plan maximum depth and oxygen exposure",
    "Understand the benefits and risks of enriched air"
   ],
   "plan": [
    [
     "Day 1",
     "Arrival and theory",
     "Theory and gas analysis practice with your instructor."
    ],
    [
     "Day 2",
     "Nitrox dives",
     "Two dives on Nitrox up to 40% oxygen. You finish certified."
    ],
    [
     "Day 3",
     "Free extra dive",
     "One extra fun dive on air."
    ],
    [
     "Day 4",
     "Departure",
     "No diving 24 hours before you fly."
    ]
   ],
   "tips": [
    "Nitrox gives you more time at 18 to 30 m. Great for photographers.",
    "Always check your gas yourself before a dive."
   ]
  },
  "deep": {
   "days": "4 days",
   "dives": "4 dives",
   "depth": "40 m",
   "age": "18+ years",
   "prereq": "SDI Advanced Adventure Diver or Open Water with 25 logged dives.",
   "group": "Max 4 students per instructor",
   "learn": [
    "Plan deep dives and gas reserves",
    "Recognise and handle nitrogen narcosis",
    "Make staged ascents and safety stops",
    "Use an emergency decompression stop"
   ],
   "plan": [
    [
     "Day 1",
     "Arrival and theory",
     "Deep diving theory, gas planning and gear checks."
    ],
    [
     "Day 2",
     "Deep dives 1 and 2",
     "Gradual dives to 30 m on Alor walls."
    ],
    [
     "Day 3",
     "Deep dives 3 and 4",
     "Final dives to 40 m. You finish certified."
    ],
    [
     "Day 4",
     "Departure",
     "No diving 24 hours before you fly."
    ]
   ],
   "tips": [
    "Deep walls like Dinding Bama are perfect for this course.",
    "Get good sleep and drink water before deep dives."
   ]
  },
  "night": {
   "days": "4 days",
   "dives": "2 dives",
   "depth": "18 m",
   "age": "12+ years",
   "prereq": "SDI Open Water Diver or equivalent.",
   "group": "Max 4 students per instructor",
   "learn": [
    "Use primary and backup torches",
    "Communicate with light signals",
    "Navigate at night and in low visibility",
    "Find animals that only come out at night"
   ],
   "plan": [
    [
     "Day 1",
     "Arrival and theory",
     "Night diving theory and torch handling."
    ],
    [
     "Day 2",
     "Night dive 1",
     "A sunset entry on a reef you dived in the day."
    ],
    [
     "Day 3",
     "Night dive 2",
     "Full night dive with critters. You finish certified."
    ],
    [
     "Day 4",
     "Departure",
     "No diving 24 hours before you fly."
    ]
   ],
   "tips": [
    "Torch rental is included.",
    "Look for octopus, shrimp and sleeping fish in the reef."
   ]
  },
  "rescue": {
   "days": "6 days",
   "dives": "8 dives",
   "depth": "18 to 30 m",
   "age": "15+ years",
   "prereq": "SDI Advanced Adventure Diver and First Aid/CPR training within 24 months.",
   "group": "Max 4 students per instructor",
   "learn": [
    "Spot stress and prevent accidents",
    "Help a tired or panicked diver at the surface",
    "Find and bring up an unresponsive diver",
    "Give rescue breaths in the water",
    "Run an emergency plan with oxygen"
   ],
   "plan": [
    [
     "Day 1",
     "Arrival and theory",
     "Rescue theory and the dive shop emergency plan."
    ],
    [
     "Day 2",
     "Self-rescue",
     "Cramps, gas problems and your own safety first."
    ],
    [
     "Day 3 to 4",
     "Rescue exercises",
     "Surface and underwater rescues in sheltered water."
    ],
    [
     "Day 5",
     "Rescue scenarios",
     "Full scenarios that combine all your skills. You finish certified."
    ],
    [
     "Day 6",
     "Departure",
     "No diving 24 hours before you fly."
    ]
   ],
   "tips": [
    "It is hard work and great fun. Most divers say it is their favourite course.",
    "Ask us if you need First Aid/CPR training first."
   ]
  },
  "msd": {
   "days": "15 days",
   "dives": "Unlimited",
   "depth": "40 m",
   "age": "18+ years",
   "prereq": "Rescue Diver, 4 SDI specialties and 50 logged dives.",
   "group": "Personal plan with your instructor",
   "learn": [
    "Finish the specialties you still need",
    "Build experience across all Alor dive sites",
    "Reach the top recreational SDI rating"
   ],
   "plan": [
    [
     "Day 1",
     "Arrival and plan",
     "We check your logbook and plan the courses and dives you need."
    ],
    [
     "Day 2 to 13",
     "Courses and dives",
     "Unlimited diving and your missing specialties."
    ],
    [
     "Day 14",
     "Final review",
     "Logbook check and Master Scuba Diver application."
    ],
    [
     "Day 15",
     "Departure",
     "No diving 24 hours before you fly."
    ]
   ],
   "tips": [
    "Bring your logbook and all certification cards."
   ]
  },
  "dm": {
   "days": "15 days",
   "dives": "Unlimited",
   "depth": "40 m",
   "age": "18+ years",
   "prereq": "SDI Rescue Diver, 40 logged dives, First Aid/CPR within 24 months and a medical statement.",
   "group": "Personal mentor",
   "learn": [
    "Lead guided dives for certified divers",
    "Assist instructors on courses",
    "Give dive briefings and site maps",
    "Plan logistics and emergency procedures",
    "Show skills at demonstration quality"
   ],
   "plan": [
    [
     "Day 1",
     "Arrival and planning",
     "Meet your mentor and plan your training."
    ],
    [
     "Day 2 to 6",
     "Theory and skills",
     "Theory exams, stamina tests and skill demonstrations."
    ],
    [
     "Day 7 to 13",
     "Internship",
     "Assist courses and lead fun dives with real guests."
    ],
    [
     "Day 14",
     "Final assessment",
     "Practical evaluation and your Divemaster card."
    ],
    [
     "Day 15",
     "Departure",
     "No diving 24 hours before you fly."
    ]
   ],
   "tips": [
    "You need 60 logged dives by the end of the course.",
    "Stay longer for more internship days. Ask us."
   ]
  },
  "tdi": {
   "days": "Depends on course",
   "dives": "Per course",
   "depth": "Per course",
   "age": "18+ years",
   "prereq": "Depends on the TDI course, usually Advanced Nitrox or more.",
   "group": "Max 2 students per instructor",
   "learn": [
    "Intro to Tech and Advanced Nitrox",
    "Decompression procedures",
    "Gas planning and multiple gases",
    "Technical sidemount"
   ],
   "plan": [
    [
     "Step 1",
     "Tell us your goal",
     "Message us with your current certification and the TDI course you want."
    ],
    [
     "Step 2",
     "We plan the program",
     "Days, gas and gear are planned around you."
    ],
    [
     "Step 3",
     "Train and certify",
     "Theory, skills and dives with a TDI instructor."
    ]
   ],
   "tips": [
    "Book early. We need time to prepare gases and gear."
   ]
  },
  "custom": {
   "days": "Your dates",
   "dives": "Your choice",
   "depth": "Per course",
   "age": "Per course",
   "prereq": "Depends on the courses you combine.",
   "group": "Planned with you",
   "learn": [
    "Combine any SDI course with specialties",
    "Add fun dives between course days",
    "Train at the pace you want"
   ],
   "plan": [
    [
     "Step 1",
     "Send your idea",
     "Tell us your dates, level and what you want to learn."
    ],
    [
     "Step 2",
     "Get your plan and price",
     "We send a day-by-day plan and pay-as-you-go quote."
    ],
    [
     "Step 3",
     "Dive",
     "Arrive and start. We adjust the plan as you go."
    ]
   ],
   "tips": [
    "Popular combo: Open Water + Nitrox in 7 days."
   ]
  }
 }
};
