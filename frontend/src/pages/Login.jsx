import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/helpers";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.identifier || !form.password) return toast.error("Fill in both fields");

    setLoading(true);
    try {
      // backend checks username OR email, so we send the same value as both
      const user = await login({
        username: form.identifier,
        email: form.identifier,
        password: form.password,
      });
      toast.success(`Welcome back, ${user.username}`);
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
        <p>Listen to what independent artists are uploading right now.</p>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Log in</h2>

        <label>
          Username or email
          <input name="identifier" value={form.identifier} onChange={handleChange} autoComplete="username" />
        </label>

        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} autoComplete="current-password" />
        </label>

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
