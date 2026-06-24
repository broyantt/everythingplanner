import styles from "./App.module.css";
import Calendar from "./components/Calendar/Calendar";
import TodoCard from "./components/TodoCard/TodoCard";
import Pomodoro from "./components/Pomodoro/Pomodoro";
import GoalTracker from "./components/GoalTracker/GoalTracker";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { IoLockClosedOutline } from "react-icons/io5";
import AuthModal from "./auth/AuthModal/AuthModal";
import { useAuth } from "./auth/AuthContext";
import { loadSummary } from "./api/todos";

export interface Todo {
  text: string;
  completed: boolean;
}

const TODAY_KEY = new Date().toLocaleDateString("en-CA");

function App() {
  const [currDate, setCurrDate] = useState(TODAY_KEY);
  const [todosSummary, setTodosSummary] = useState<
    Record<string, "completed" | "ongoing">
  >({});

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { token, logout } = useAuth();

  useEffect(() => {
    async function fetch() {
      const summary = await loadSummary();
      setTodosSummary(summary);
    }
    fetch();
  }, [currDate]);

  return (
    <>
      <div className={styles.authSection}>
        {token ? (
          <button
            onClick={() => {
              logout();
            }}
            className={styles.authButton}
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => {
              setIsAuthOpen(true);
            }}
            className={styles.authButton}
          >
            Login
          </button>
        )}
      </div>
      {isAuthOpen && (
        <AuthModal
          onClose={() => {
            setIsAuthOpen(false);
          }}
        />
      )}
      <div className={styles.navbar}>
        <Link to="/goals">
          <IoLockClosedOutline className={styles.goalLogo} />
        </Link>
        <Pomodoro currDate={currDate} />
        <Link to="/">
          <FaRegCalendarAlt className={styles.calendarLogo} />
        </Link>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className={styles.mainContainer}>
                <Calendar
                  currDate={currDate}
                  onDateChange={setCurrDate}
                  todosSummary={todosSummary}
                />
                <TodoCard currDate={currDate} />
              </div>
            </>
          }
        />
        <Route path="/goals" element={<GoalTracker />} />
      </Routes>
    </>
  );
}

export default App;
