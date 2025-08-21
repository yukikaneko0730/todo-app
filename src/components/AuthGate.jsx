// src/components/AuthGate.jsx
import { useAuth } from "../contexts/AuthContext";
import AuthPage from "../pages/Auth";

export default function AuthGate({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading…</p>
      </div>
    );
  }
  return user ? children : <AuthPage />;
}
