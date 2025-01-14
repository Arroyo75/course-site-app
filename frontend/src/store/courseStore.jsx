import { create } from "zustand";
import { apiFetch } from './authStore.jsx'

export const useCourseStore = create((set) => ({
  courses: [],
  setCourses: (courses) => set({ courses }),
  userCourses: {
    created: [],
    enrolled: []
  },
  searchResults: [],
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
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
  },
  updateCourse: async (cid, formData) => {
    if(!formData.title && !formData.description && !formData.image) {
      return { success: false, message: "Please make your change"};
    }

    console.log(cid);
    const res = await apiFetch(`/api/courses/${cid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    
    const data = await res.json();

    if(!data.success)
      return { success: false, message: data.message }

    set(state => ({ courses: state.courses.map(course => course._id === cid ? data.data : course )}));
    return { success: true, message: data.message }
  },
  enrollInCourse: async (cid) => {
    const res = await apiFetch(`/api/courses/${cid}/enroll`, {
      method: "POST"
    });
    const data = await res.json();

    if(data.success) {
      set((state) => ({
        courses: state.courses.map(course => 
          course._id === cid 
            ? { 
                ...course, 
                students: [...course.students, data.userId] 
              }
            : course
        )
      }));
      return { success: true, message: data.message };
     } else
      return { success: false, message: data.message };
  },
  fetchUserCourses: async () => {
    const res = await apiFetch("/api/courses/user");
    const data = await res.json();

    if(data.success) {
      set({
        userCourses: {
          created: data.data.createdCourses,
          enrolled: data.data.enrolledCourses
        }
      });
    }
    return data;
  },
  searchCourses: async (query) => {
    try {
      if (!query.trim()) {
        set({ searchResults: [] });
        return;
      }
      const res = await apiFetch(`/api/courses/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if(data.success) {
        set({ searchResults: data.data });
      }
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}));