import { useState, useEffect } from "react";
import { LuUndo2 } from "react-icons/lu";
import { MdSwitchRight } from "react-icons/md";
import styles from "./Pomodoro.module.css";
import pomodoroSparkle from "../../assets/pomodoroSparkle.mp3";
import {
  loadAllSessions,
  loadSessions,
  saveSessions,
} from "../../api/sessions";

const DEFAULT_TIME_WORK = 3600;
const DEFAULT_TIME_REST = 900;

interface PomodoroProps {
  currDate: string;
}

export default function Pomodoro({ currDate }: PomodoroProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(DEFAULT_TIME_WORK);
  const [mode, setMode] = useState<"Work" | "Rest">("Work");

  const [todayCount, setTodayCount] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    async function fetch() {
      const count = await loadSessions(currDate);
      const totalCount = await loadAllSessions();
      setTodayCount(count);
      setTotalSessions(totalCount);
    }
    fetch();
  }, [currDate]);

  function formatTime(s: number) {
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  async function handleIncrementSession() {
    const newCount = todayCount + 1;
    setTodayCount(newCount);
    setTotalSessions(totalSessions + 1);
    await saveSessions(currDate, newCount);
  }

  useEffect(() => {
    if (!isRunning) return;
    const endTimestamp = Date.now() + seconds * 1000;
    const intervalId = setInterval(() => {
      setSeconds(() => {
        const remainingTime = Math.ceil((endTimestamp - Date.now()) / 1000);
        if (remainingTime <= 0) {
          return 0;
        }
        return remainingTime;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      document.title = `everythingplanner - ${formatTime(seconds)}`;
    }
    if (seconds === 0) {
      document.title = "everythingplanner";
      setIsRunning(false);
      const audioDing = new Audio(pomodoroSparkle);
      audioDing.play();
      if (mode === "Work") {
        handleIncrementSession();
      }
      setMode(mode === "Work" ? "Rest" : "Work");
    }
  }, [seconds]);

  useEffect(() => {
    setSeconds(mode === "Work" ? DEFAULT_TIME_WORK : DEFAULT_TIME_REST);
  }, [mode]);

  return (
    <>
      <div className={styles.clockTimer}>
        <div className={styles.counterContainer}>
          <span className={styles.todayStat}>today: {todayCount}</span>
          <span className={styles.divider}></span>
          <span className={styles.allTimeStat}>total: {totalSessions}</span>
        </div>

        <div className={styles.clockTimerTop}>
          <button
            className={styles.topButton}
            onClick={() => {
              setIsRunning(false);
              setMode(mode === "Work" ? "Rest" : "Work");
            }}
          >
            <MdSwitchRight />
          </button>
          <span>{formatTime(seconds)} </span>

          <button
            className={styles.topButton}
            onClick={() => {
              setIsRunning(false);
              setSeconds(
                mode === "Work" ? DEFAULT_TIME_WORK : DEFAULT_TIME_REST,
              );
            }}
          >
            <LuUndo2 />
          </button>
        </div>

        <div className={styles.clockButtons}>
          <button
            className={styles.playButton}
            onClick={() => {
              setIsRunning(!isRunning);
            }}
          >
            <div className={styles.circleContainer}>
              <div
                className={`${styles.stopSquare} ${isRunning ? styles.visible : ""}`}
              ></div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
