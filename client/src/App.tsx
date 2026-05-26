import styles from "./App.module.css";
import Calendar from "./components/Calendar/Calendar";
import TodoCard from "./components/TodoCard/TodoCard";
import Pomodoro from "./components/Pomodoro/Pomodoro";
import GoalTracker from "./components/GoalTracker/GoalTracker";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { IoLockClosedOutline } from "react-icons/io5";
import AuthModal from "./auth/AuthModal/AuthModal";
import { useAuth } from "./auth/AuthContext";

export interface Todo {
  text: string;
  completed: boolean;
}

const TODAY_KEY = new Date().toLocaleDateString("en-CA");

const SEED_TODOS: Record<string, Todo[]> = {
  [TODAY_KEY]: [
    { text: "double-click any todo to edit it.", completed: false },
    { text: "checkbox marks it as done :)", completed: true },
    { text: "trash icon deletes a todo!", completed: false },
  ],
};

function App() {
  const [currDate, setCurrDate] = useState(TODAY_KEY);
  const [allTodos, setAllTodos] = useState<Record<string, Todo[]>>(() => {
    const saved = localStorage.getItem("allTodos");
    return saved ? JSON.parse(saved) : SEED_TODOS;
  });

  const [allSessions, setAllSessions] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("allSessions");
    return saved ? JSON.parse(saved) : {};
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { token, logout } = useAuth();

  useEffect(() => {
    const newTodos = JSON.stringify(allTodos);
    localStorage.setItem("allTodos", newTodos);
  }, [allTodos]);

  useEffect(() => {
    const newSessions = JSON.stringify(allSessions);
    localStorage.setItem("allSessions", newSessions);
  }, [allSessions]);

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
        <Pomodoro
          currDate={currDate}
          allSessions={allSessions}
          onSessionChange={setAllSessions}
        />
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
                  allTodos={allTodos}
                  currDate={currDate}
                  onDateChange={setCurrDate}
                />
                <TodoCard
                  allTodos={allTodos}
                  onTodoChange={setAllTodos}
                  currDate={currDate}
                />
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
