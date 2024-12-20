import { create } from "zustand";
import { apiFetch } from './authStore.jsx'

export const useCourseStore = create((set) => ({
  courses: [],
  setCourses: (courses) => set({ courses }),
  createCourse: async (newCourse) => {
    if(!newCourse.title || !newCourse.description || !newCourse.image) {
      return { success: false, message: "Please fill all fields"};
    }
    const res = await apiFetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newCourse)
    });
    const data = await res.json();
    set((state) => ({ courses: [ ...state.courses, data.data]}));
    return { success: true, message: "Course created successfully"}
  },
  fetchCourses: async () => {
    const res = await apiFetch("api/courses");
    const data = await res.json();
    set({ courses: data.data });
  },
  deleteCourse: async (cid) => {
    const res = await apiFetch(`/api/courses/${cid}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if(!data.success) return { success: false, message: data.message };
    set(state => ({ courses: state.courses.filter( course => course._id !== cid) }));
    return { success: true, message: data.message }
  }
}));