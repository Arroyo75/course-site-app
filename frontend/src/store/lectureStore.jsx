import { create } from 'zustand';
import { apiFetch } from './authStore.jsx';

export const useLectureStore = create((set) => ({
  lectures: [],
  setLectures: (lectures) => set({ lectures }),
  createLecture: async (newLecture, cid) => {
    if (!newLecture.title || !newLecture.file) {
      return { success: false, message: "Please fill all fields and upload a file" };
    }

    const formData = new FormData();
    formData.append('title', newLecture.title);
    formData.append('file', newLecture.file);
    formData.append('course', cid);

    console.log(newLecture.file);

    const res = await apiFetch("/api/lectures", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    
    if (!data.success) {
      return { success: false, message: data.message };
    }

    set((state) => ({ lectures: [...state.lectures, data.data] }));
    return { success: true, data: data.data };
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
    if(!updatedLecture.title) {
      return { success: false, message: "Please fill all fields"};
    }

    const res = await apiFetch(`/api/lectures/${lid}`, {
      method: "PUT",
      headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedLecture)
    });
    
    const data = await res.json();

    if(!data.success)
      return { success: false, message: data.message }

    set(state => ({ lectures: state.lectures.map((lecture) => (lecture._id === lid ? data.data : lecture))}))
    return { success: true, message: data.message }
  },
  downloadLecture: async (lid) => {
    try {
      const response = await apiFetch(`/api/lectures/download/${lid}`, {
        _rawResponse: true
      });

      if(!response.ok) {
        throw new Error('Download failed');
      }

      const contentDisposition = response.header.get('content-disposition');
      let filename = 'lecture.pdf';
      if(contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if(filenameMatch)
          filename = filenameMatch[1];
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href=  url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectIRL(url);

      return { success: true };
    } catch (error) {
      console.error('Download error', error);
      return { success: false, message: 'Failed to download file'}
    }
  }
}));