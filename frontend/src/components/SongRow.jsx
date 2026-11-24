import { usePlayer } from "../context/PlayerContext";
import { coverColor } from "../utils/helpers";

function SongRow({ song, index, list, artistName }) {
  const { currentSong, isPlaying, playSong } = usePlayer();
  const isActive = currentSong?._id === song._id;

  // artist is populated on /music but not inside album musics
  const artist = artistName || song.artist?.username || "Unknown artist";

  return (
    <div
      className={`song-row ${isActive ? "active" : ""}`}
      onClick={() => playSong(song, list)}
    >
      <span className="song-index">
        {isActive && isPlaying ? (
          <span className="mini-bars"><i /><i /><i /></span>
        ) : (
          index + 1
        )}
      </span>

      <div className="song-cover" style={{ background: coverColor(song.title) }}>
        {song.title?.[0]?.toUpperCase()}
      </div>

      <div className="song-info">
        <p className="song-title">{song.title}</p>
        <p className="song-artist">{artist}</p>
      </div>

      <button
        className="play-btn"
        aria-label={isActive && isPlaying ? "Pause" : "Play"}
        onClick={(e) => {
          e.stopPropagation();
          playSong(song, list);
        }}
      >
        {isActive && isPlaying ? "❚❚" : "▶"}
      </button>
    </div>
  );
}

export default SongRow;
