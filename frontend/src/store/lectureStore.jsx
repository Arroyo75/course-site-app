import { create } from 'zustand';
import { apiFetch } from './authStore.jsx';

export const lectureStore = create((set) => ({
  lectures: [],
  setLectures: (lectures) => set({ lectures }),
  createLecture: async (newLecture, cid) => {
    if(!newLecture.title) {
      return { success: false, message: "Please fill all fields"};
    }
    const res = await apiFetch("/api/lectures", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({newLecture, course: cid})
    });
    const data = await res.json();
    set((state) => ({ lectures: [ ...state.lectures, data.data]}));
    return ({ success: true, data: newLecture });
  },
  fetchLectures: async (cid) => {
    const res = await apiFetch(`/api/lectures/${cid}`);
    const data = await res.json();
    set({lectures: data.data});
  },
  deleteLecture: async (lid) => {
    const res = await apiFetch(`/api/fetch/${lid}`, {
      method: "DELETE"
    });
    const data = await res.json();

    if(!data.success)
      return { success: false, message: data.message}

    set(state => ({ lectures: state.lectures.filter( lecture => lecture._id !== lid)}));
    return { success: true, message: data.message}
  }
}));