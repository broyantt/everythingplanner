import styles from "./AuthModal.module.css";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import { apiFetch } from "../api";

type AuthModalProps = {
  onClose: () => void;
};

export default function AuthModal({ onClose }: AuthModalProps) {
  const { login } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const body =
        mode === "login" ? { email, password } : { username, email, password };
      const { token } = await apiFetch(path, {
        method: "POST",
        body: JSON.stringify(body),
      });
      login(token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div onClick={onClose} className={styles.overlayModal}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={styles.modal}
      >
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            {mode === "register" && (
              <input
                value={username}
                className={styles.authInput}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                placeholder="enter username"
              />
            )}
            <input
              value={email}
              className={styles.authInput}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="enter email"
            />
            <input
              value={password}
              type="password"
              className={styles.authInput}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="enter password"
            />
          </div>
          <div className={styles.authButtons}>
            <button
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError(null);
              }}
              type="button"
              className={styles.secondaryButton}
            >
              {mode === "login"
                ? "create an account"
                : "login to an existing account"}
            </button>
            <button
              disabled={submitting}
              type="submit"
              className={styles.primaryButton}
            >
              {mode === "login" ? "login" : "sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
