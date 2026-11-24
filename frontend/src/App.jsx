import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Player from "./components/Player";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Albums from "./pages/Albums";
import AlbumDetails from "./pages/AlbumDetails";
import ArtistDashboard from "./pages/ArtistDashboard";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  // send each role to their own landing page
  const homePath = user?.role === "artist" ? "/dashboard" : "/";

  return (
    <div className="app">
      {user && <Navbar />}

      <main className="main">
        <Routes>
          <Route path="/login" element={user ? <Navigate to={homePath} /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to={homePath} /> : <Register />} />

          <Route element={<ProtectedRoute role="user" />}>
            <Route path="/" element={<Home />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/albums/:albumId" element={<AlbumDetails />} />
          </Route>

          <Route element={<ProtectedRoute role="artist" />}>
            <Route path="/dashboard" element={<ArtistDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {user?.role === "user" && <Player />}
    </div>
  );
}

export default App;
