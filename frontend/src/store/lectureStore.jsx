import { create } from 'zustand';
import { apiFetch } from './authStore.jsx';

export const useLectureStore = create((set, get) => ({
  lectures: [],
  completedLectures: [],
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
      return ({ success: false, message: data.message })
    }

    set((state) => ({ lectures: [ ...state.lectures, data.data]}));
    return ({ success: true, data: newLecture });
  },
  fetchLectures: async (cid, isEnrolled) => {
    const res = await apiFetch(`/api/lectures/${cid}`);
    const data = await res.json();
    set({lectures: data.data});

    if(isEnrolled) {
      const progressRes = await apiFetch(`/api/progress/courses/${cid}`);
      const progressData = await progressRes.json();
        
      if (progressData.success) {
        const completedIds = progressData.data.map(item => item.lecture);
        set({ completedLectures: completedIds });
      }
    }
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
  },
  downloadLecture: async (cid, lid) => {
    const res = await apiFetch(`/api/lectures/download/${lid}`);
    const data = await res.json();

    if(data.success) {
      const link = document.createElement('a');
      link.href = data.data.url;
      link.setAttribute('download', data.data.filename);  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const markRes = await apiFetch(`/api/progress/courses/${cid}/lectures/${lid}/complete`, {
        method: 'POST'
      })

      if(markRes.ok) {
        set(state => ({
          completedLectures: [...state.completedLectures, lid]
        }))
      }

      return { success: true, message: "Download Started"};
    } else {
      return { success: false, message: data.message }
    }
  },
  isLectureCompleted: (lid) => {
    return get().completedLectures.includes(lid);
  },
  getCompletionPercantage: () => {
    const { lectures, completedLectures} = get();
    if(lectures.length === 0) return 0;
    return Math.round((completedLectures.length / lectures.length) * 100);
  }
}));