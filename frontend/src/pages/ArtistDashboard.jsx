import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { uploadMusic, createAlbum } from "../api/services";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";
import { coverColor, getErrorMessage } from "../utils/helpers";

// NOTE: backend doesn't have a "get my songs" route for artists yet,
// so we remember uploads in localStorage to let the artist build albums.
const storageKey = (id) => `uploads_${id}`;

function ArtistDashboard() {
  const { user } = useAuth();
  const fileRef = useRef(null);

  const [myUploads, setMyUploads] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey(user.id))) || [];
    } catch {
      return [];
    }
  });

  // upload form
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // album form
  const [albumTitle, setAlbumTitle] = useState("");
  const [selected, setSelected] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey(user.id), JSON.stringify(myUploads));
  }, [myUploads, user.id]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("audio/")) {
      toast.error("Pick an audio file (mp3, wav, etc.)");
      e.target.value = "";
      return;
    }
    setFile(f);
    // prefill title from file name if empty
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title.trim() || !file) return toast.error("Add a title and choose a file");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("music", file); // field name must match upload.single("music")

    setUploading(true);
    setUploadProgress(0);
    try {
      const res = await uploadMusic(formData, setUploadProgress);
      const m = res.data.music;
      setMyUploads((prev) => [{ _id: m.id, title: m.title, uri: m.uri }, ...prev]);
      toast.success(`"${m.title}" uploaded`);
      setTitle("");
      setFile(null);
      fileRef.current.value = "";
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!albumTitle.trim()) return toast.error("Give the album a title");
    if (selected.length === 0) return toast.error("Pick at least one song");

    setCreating(true);
    try {
      await createAlbum({ title: albumTitle.trim(), musics: selected });
      toast.success(`Album "${albumTitle}" created`);
      setAlbumTitle("");
      setSelected([]);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <h1>Studio</h1>
          <p className="muted">Upload tracks and group them into albums</p>
        </div>
      </div>

      <div className="studio-grid">
        {/* ---------- Upload ---------- */}
        <form className="panel" onSubmit={handleUpload}>
          <h2>Upload a song</h2>

          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Song title" />
          </label>

          <label className={`dropzone ${file ? "has-file" : ""}`}>
            <input ref={fileRef} type="file" accept="audio/*" onChange={handleFileChange} hidden />
            {file ? (
              <>
                <strong>{file.name}</strong>
                <small>{(file.size / (1024 * 1024)).toFixed(2)} MB • click to change</small>
              </>
            ) : (
              <>
                <strong>Choose an audio file</strong>
                <small>mp3, wav or m4a</small>
              </>
            )}
          </label>

          {uploading && (
            <div className="upload-progress">
              <div style={{ width: `${uploadProgress}%` }} />
            </div>
          )}

          <button className="btn btn-primary btn-block" disabled={uploading}>
            {uploading ? `Uploading ${uploadProgress}%` : "Upload song"}
          </button>
        </form>

        {/* ---------- Create album ---------- */}
        <form className="panel" onSubmit={handleCreateAlbum}>
          <h2>Create an album</h2>

          <label>
            Album title
            <input value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} placeholder="Album title" />
          </label>

          <p className="label-text">
            Songs <span className="muted">({selected.length} selected)</span>
          </p>

          {myUploads.length === 0 ? (
            <EmptyState title="No uploads yet" text="Upload a song first, then add it to an album here." />
          ) : (
            <div className="pick-list">
              {myUploads.map((song) => (
                <label key={song._id} className={`pick-item ${selected.includes(song._id) ? "picked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={selected.includes(song._id)}
                    onChange={() => toggleSelect(song._id)}
                  />
                  <span className="pick-dot" style={{ background: coverColor(song.title) }} />
                  {song.title}
                </label>
              ))}
            </div>
          )}

          <button className="btn btn-primary btn-block" disabled={creating || myUploads.length === 0}>
            {creating ? "Creating album..." : "Create album"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ArtistDashboard;
