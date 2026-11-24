import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";

function NotFound() {
  return (
    <div className="page">
      <EmptyState title="404" text="This page doesn't exist.">
        <Link to="/" className="btn btn-primary">Go home</Link>
      </EmptyState>
    </div>
  );
}

export default NotFound;
