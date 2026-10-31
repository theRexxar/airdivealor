import { COURSES, DETAILS } from "./courses-data";
import type { Course, CourseLevel } from "./courses-types";

export { COURSES, DETAILS };
export type { Course, CourseLevel };

export const LEVELS: ("All" | CourseLevel)[] = ["All", "Beginner", "Advanced", "Specialty", "Professional", "Technical", "Custom"];
export const courseHref = (id: string) => `/dive-courses/${id}`;
export const bookCourseMsg = (c: Course) => `Hi Air Dive Alor, I would like to book the ${c.name} (${c.price}).`;
