import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // send the token cookie with every request
});

// if the token is missing/expired, kick the user back to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.includes("/auth/")) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
