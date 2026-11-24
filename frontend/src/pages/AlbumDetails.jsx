import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getAlbumById } from "../api/services";
import { usePlayer } from "../context/PlayerContext";
import SongRow from "../components/SongRow";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { coverColor, getErrorMessage } from "../utils/helpers";

function AlbumDetails() {
  const { albumId } = useParams();
  const { playSong } = usePlayer();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAlbumById(albumId)
      .then((res) => setAlbum(res.data.album))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [albumId]);

  if (loading) return <Loader text="Opening album..." />;

  if (!album) {
    return (
      <EmptyState title="Album not found" text="It may have been removed.">
        <Link to="/albums" className="btn btn-ghost">Back to albums</Link>
      </EmptyState>
    );
  }

  const songs = album.musics || [];

  return (
    <section className="page">
      <Link to="/albums" className="back-link">← Albums</Link>

      <div className="album-hero">
        <div className="album-art large" style={{ "--c": coverColor(album.title) }}>
          <span>{album.title?.[0]?.toUpperCase()}</span>
        </div>
        <div>
          <p className="muted">Album</p>
          <h1>{album.title}</h1>
          <p className="muted">
            {album.artist?.username} • {songs.length} {songs.length === 1 ? "song" : "songs"}
          </p>
          {songs.length > 0 && (
            <button className="btn btn-primary" onClick={() => playSong(songs[0], songs)}>
              ▶ Play album
            </button>
          )}
        </div>
      </div>

      {songs.length === 0 ? (
        <EmptyState title="This album is empty" />
      ) : (
        <div className="song-list">
          {songs.map((song, i) => (
            <SongRow
              key={song._id}
              song={song}
              index={i}
              list={songs}
              artistName={album.artist?.username}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default AlbumDetails;
