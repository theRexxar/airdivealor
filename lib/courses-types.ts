export type CourseLevel = "Beginner" | "Advanced" | "Specialty" | "Professional" | "Technical" | "Custom";

export interface Course {
  id: string;
  level: CourseLevel;
  name: string;
  price: string;
  stay: string;
  dives: string;
  img: string;
  text: string;
  /** "What's included" items; each maps to an icon and description in CourseDetails.included. */
  incl: string[];
}

export interface CourseDetail {
  days: string;
  dives: string;
  depth: string;
  age: string;
  prereq: string;
  group: string;
  learn: string[];
  /** [day label, title, description] */
  plan: [string, string, string][];
  tips: string[];
}

export interface CourseDetails {
  /** item → [icon name, description] */
  included: Record<string, [string, string]>;
  certDetail: string;
  notIncluded: string[];
  courses: Record<string, CourseDetail>;
}
