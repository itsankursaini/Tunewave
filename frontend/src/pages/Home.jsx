import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getAllMusics } from "../api/services";
import SongRow from "../components/SongRow";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/helpers";

function Home() {
  const { user } = useAuth();
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const res = await getAllMusics();
        setMusics(res.data.musics);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchMusics();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return musics;
    return musics.filter(
      (m) => m.title.toLowerCase().includes(q) || m.artist?.username?.toLowerCase().includes(q)
    );
  }, [musics, search]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <h1>{greeting()}, {user.username}</h1>
          <p className="muted">{musics.length} songs in the library</p>
        </div>
        <input
          className="search"
          placeholder="Search songs or artists"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <Loader text="Fetching songs..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? "No matches" : "No songs yet"}
          text={search ? `Nothing found for "${search}". Try another title or artist.` : "Songs will show up here once artists upload them."}
        />
      ) : (
        <div className="song-list">
          {filtered.map((song, i) => (
            <SongRow key={song._id} song={song} index={i} list={filtered} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;
