/** Link to a course page. Course content lives in the CMS ("courses" collection); lib/courses-data.ts is only the source of the built-in defaults. */
export const courseHref = (id: string) => `/dive-courses/${id}`;
