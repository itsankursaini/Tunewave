export const formatTime = (sec) => {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const getErrorMessage = (err) =>
  err?.response?.data?.message || "Something went wrong. Try again.";

// gives every song a stable cover color based on its title
export const coverColor = (text = "") => {
  const colors = ["#ff6b8b", "#ffb547", "#7c6cff", "#3fd0c9", "#ff8a4c", "#b46cff"];
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = text.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};
