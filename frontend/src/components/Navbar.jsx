import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { stop } = usePlayer();
  const navigate = useNavigate();

  const handleLogout = async () => {
    stop();
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <NavLink to={user.role === "artist" ? "/dashboard" : "/"} className="logo">
        <span className="logo-disc" />
        Tunewave
      </NavLink>

      <nav className="nav-links">
        {user.role === "user" ? (
          <>
            <NavLink to="/" end>Songs</NavLink>
            <NavLink to="/albums">Albums</NavLink>
          </>
        ) : (
          <NavLink to="/dashboard">Studio</NavLink>
        )}
      </nav>

      <div className="nav-user">
        <div className="avatar">{user.username?.[0]?.toUpperCase()}</div>
        <div className="nav-user-info">
          <span>{user.username}</span>
          <small>{user.role === "artist" ? "Artist" : "Listener"}</small>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}

export default Navbar;
