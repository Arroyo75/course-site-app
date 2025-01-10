import { create } from 'zustand';
import { apiFetch } from './authStore.jsx';

export const useLectureStore = create((set) => ({
  lectures: [],
  setLectures: (lectures) => set({ lectures }),
  createLecture: async (newLecture) => {
    if(!newLecture.get('title') || !newLecture.get('lecture')) {
      return { success: false, message: "Please fill all fields"};
    }
    const res = await apiFetch("/api/lectures", {
      method: "POST",
      body: newLecture
    });
    const data = await res.json();

    if(!data.success) {
      return ({ successs: false, message: data.message })
    }

    set((state) => ({ lectures: [ ...state.lectures, data.data]}));
    return ({ success: true, data: newLecture });
  },
  fetchLectures: async (cid) => {
    const res = await apiFetch(`/api/lectures/${cid}`);
    const data = await res.json();
    set({lectures: data.data});
  },
  deleteLecture: async (lid) => {
    const res = await apiFetch(`/api/lectures/${lid}`, {
      method: "DELETE"
    });
    const data = await res.json();

    if(!data.success)
      return { success: false, message: data.message}

    set(state => ({ lectures: state.lectures.filter( lecture => lecture._id !== lid)}));
    return { success: true, message: data.message}
  },
  updateLecture: async (updatedLecture, lid) => {
    if(!updatedLecture.has('title') && !updatedLecture.has('lecture')) {
      return { success: false, message: "Please make your change"};
    }

    const res = await apiFetch(`/api/lectures/${lid}`, {
      method: "PUT",
      body: updatedLecture
    });
    
    const data = await res.json();

    if(!data.success)
      return { success: false, message: data.message }

    set(state => ({ lectures: state.lectures.map((lecture) => (lecture._id === lid ? data.data : lecture))}))
    return { success: true, message: data.message }
  }
}));