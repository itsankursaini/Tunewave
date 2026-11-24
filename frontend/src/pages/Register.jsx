import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/helpers";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) return toast.error("All fields are required");
    if (form.password.length < 6) return toast.error("Password should be at least 6 characters");

    setLoading(true);
    try {
      const user = await register(form);
      toast.success("Account created");
      navigate(user.role === "artist" ? "/dashboard" : "/");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-side">
        <span className="big-disc" />
        <h1>Tunewave</h1>
        <p>Join as a listener to stream, or as an artist to upload your own tracks.</p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create account</h2>

        <div className="role-toggle">
          <button
            type="button"
            className={form.role === "user" ? "selected" : ""}
            onClick={() => setForm({ ...form, role: "user" })}
          >
            I want to listen
          </button>
          <button
            type="button"
            className={form.role === "artist" ? "selected" : ""}
            onClick={() => setForm({ ...form, role: "artist" })}
          >
            I make music
          </button>
        </div>

        <label>
          Username
          <input name="username" value={form.username} onChange={handleChange} autoComplete="username" />
        </label>

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" />
        </label>

        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} autoComplete="new-password" />
        </label>

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
