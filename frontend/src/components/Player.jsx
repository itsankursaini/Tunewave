import { usePlayer } from "../context/PlayerContext";
import { formatTime, coverColor } from "../utils/helpers";

function Player() {
  const {
    currentSong, isPlaying, progress, duration, volume,
    togglePlay, playNext, playPrev, seek, setVolume,
  } = usePlayer();

  if (!currentSong) return null;

  const percent = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="player">
      <div className="player-song">
        <div
          className={`vinyl ${isPlaying ? "spinning" : ""}`}
          style={{ "--label": coverColor(currentSong.title) }}
        />
        <div>
          <p className="song-title">{currentSong.title}</p>
          <p className="song-artist">{currentSong.artist?.username || "Now playing"}</p>
        </div>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button onClick={playPrev} aria-label="Previous">⏮</button>
          <button className="main-play" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <button onClick={playNext} aria-label="Next">⏭</button>
        </div>

        <div className="progress">
          <span>{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            style={{ "--fill": `${percent}%` }}
            aria-label="Seek"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-volume">
        <span>🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{ "--fill": `${volume * 100}%` }}
          aria-label="Volume"
        />
      </div>
    </div>
  );
}

export default Player;
