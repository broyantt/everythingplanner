import { DatePicker } from "@douyinfe/semi-ui";
import styles from "./Calendar.module.css";

interface CalendarProps {
  onDateChange: (date: string) => void;
  currDate: string;
  todosSummary: Record<string, "completed" | "ongoing">;
}

export default function Calendar({
  onDateChange,
  currDate,
  todosSummary,
}: CalendarProps) {
  function renderDate(dayNumber?: number, fullDate?: string) {
    if (!fullDate) return dayNumber;
    const status = todosSummary[fullDate];
    if (!status) return dayNumber;
    return (
      <div className={styles.dateItemContainer}>
        {dayNumber}
        <span
          className={
            status === "completed"
              ? styles.todoDotCompleted
              : styles.todoDotOngoing
          }
        />
      </div>
    );
  }

  return (
    <>
      <DatePicker
        size="large"
        className={styles.calendar}
        defaultValue={currDate}
        placeholder={"hey phinneas, whatcha dooooin"}
        onChange={(_, dateString) => {
          onDateChange(dateString as string);
        }}
        renderDate={renderDate}
      />
    </>
  );
}
