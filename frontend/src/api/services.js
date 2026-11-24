import api from "./axios";

// ---------- auth ----------
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const logoutUser = () => api.post("/auth/logout");

// ---------- music ----------
export const getAllMusics = () => api.get("/music");
export const getAllAlbums = () => api.get("/music/albums");
export const getAlbumById = (id) => api.get(`/music/albums/${id}`);

export const uploadMusic = (formData, onProgress) =>
  api.post("/music/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
    },
  });

export const createAlbum = (data) => api.post("/music/album", data);
