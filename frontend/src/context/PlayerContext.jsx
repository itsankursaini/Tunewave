import { createContext, useContext, useEffect, useRef, useState } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const currentSong = queue[currentIndex] || null;

  // load a new song whenever the index/queue changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentSong) return;
    audio.src = currentSong.uri;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [currentSong]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    const onTime = () => setProgress(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => playNext();

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentIndex]);

  // play a song from a list (the list becomes the queue)
  const playSong = (song, list = [song]) => {
    if (currentSong?._id === song._id) {
      togglePlay();
      return;
    }
    setQueue(list);
    setCurrentIndex(list.findIndex((s) => s._id === song._id));
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!currentSong) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const playNext = () => {
    if (currentIndex < queue.length - 1) setCurrentIndex((i) => i + 1);
    else setIsPlaying(false);
  };

  const playPrev = () => {
    // restart the song if we're a few seconds in, like spotify does
    if (audioRef.current.currentTime > 3 || currentIndex === 0) {
      audioRef.current.currentTime = 0;
    } else {
      setCurrentIndex((i) => i - 1);
    }
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const stop = () => {
    audioRef.current.pause();
    audioRef.current.src = "";
    setQueue([]);
    setCurrentIndex(-1);
    setIsPlaying(false);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong, isPlaying, progress, duration, volume,
        playSong, togglePlay, playNext, playPrev, seek, setVolume, stop,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
