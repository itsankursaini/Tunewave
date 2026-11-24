import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllAlbums } from "../api/services";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { coverColor, getErrorMessage } from "../utils/helpers";

function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAlbums()
      .then((res) => setAlbums(res.data.albums))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <h1>Albums</h1>
          <p className="muted">Full records from artists on Tunewave</p>
        </div>
      </div>

      {loading ? (
        <Loader text="Fetching albums..." />
      ) : albums.length === 0 ? (
        <EmptyState title="No albums yet" text="Albums appear here once artists put them together." />
      ) : (
        <div className="album-grid">
          {albums.map((album) => (
            <Link to={`/albums/${album._id}`} key={album._id} className="album-card">
              <div className="album-art" style={{ "--c": coverColor(album.title) }}>
                <span>{album.title?.[0]?.toUpperCase()}</span>
              </div>
              <h3>{album.title}</h3>
              <p>{album.artist?.username || "Unknown artist"}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default Albums;
