import styles from "./App.module.css";
import Calendar from "./components/Calendar/Calendar";
import TodoCard from "./components/TodoCard/TodoCard";
import Pomodoro from "./components/Pomodoro/Pomodoro";
import GoalTracker from "./components/GoalTracker/GoalTracker";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { IoLockClosedOutline } from "react-icons/io5";
import AuthModal from "./auth/AuthModal/AuthModal";
import { useAuth } from "./auth/AuthContext";

export interface Todo {
  text: string;
  completed: boolean;
}

const TODAY_KEY = new Date().toLocaleDateString("en-CA");

function App() {
  const [currDate, setCurrDate] = useState(TODAY_KEY);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { token, logout } = useAuth();

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
                <Calendar currDate={currDate} onDateChange={setCurrDate} />
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
