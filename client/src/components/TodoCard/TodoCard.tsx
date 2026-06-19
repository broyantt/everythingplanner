import styles from "./TodoCard.module.css";
import { useState, useEffect, type ChangeEvent } from "react";
import type { Todo } from "../../App";
import { FaRegTrashAlt } from "react-icons/fa";
import { loadTodos, saveTodos } from "../../api/todos";

interface TodoCardProps {
  currDate: string;
}

export default function TodoCard({ currDate }: TodoCardProps) {
  const [inputText, setInputText] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const [edittingIndex, setEdittingIndex] = useState<number>();
  const [todoInput, setTodoInput] = useState("");

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const result = await loadTodos(currDate);
      setTodos(result);
      setLoading(false);
    }
    fetch();
  }, [currDate]);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInputText(e.target.value);
  }

  function handleTodoInputChange(e: ChangeEvent<HTMLInputElement>) {
    setTodoInput(e.target.value);
  }

  async function handleDeleteTodo(index: number) {
    const updatedTodos = todos.filter((_, i) => {
      if (i === index) {
        return false;
      }
      return true;
    });
    setTodos(updatedTodos);
    await saveTodos(currDate, updatedTodos);
  }

  async function handleToggleTodo(index: number) {
    const updatedTodos = todos.map((todo, i) => {
      if (i === index) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
    await saveTodos(currDate, updatedTodos);
  }

  async function handleAddTodo() {
    if (inputText === "") {
      setIsShaking(true);
      return;
    }
    const updatedTodos = [...todos, { text: inputText, completed: false }];
    setTodos(updatedTodos);
    await saveTodos(currDate, updatedTodos);
    setInputText("");
  }

  async function handleEditTodoEnter() {
    if (todoInput === "") {
      setIsShaking(true);
      return;
    }
    const updatedTodos = todos.map((todo, index) => {
      if (index === edittingIndex) {
        return { ...todo, text: todoInput };
      }
      return todo;
    });
    setTodos(updatedTodos);
    await saveTodos(currDate, updatedTodos);
    setEdittingIndex(undefined);
  }

  function handleEditTodo(index: number) {
    setEdittingIndex(index);
    setTodoInput(todos[index].text);
  }

  return (
    <>
      {currDate && (
        <div className={styles.cardTodoList}>
          <span className={styles.title}>Today's date is: {currDate} </span>
          <input
            value={inputText}
            className={`${styles.inputTodo} ${isShaking ? styles.shake : ""}`}
            onAnimationEnd={() => {
              setIsShaking(false);
            }}
            placeholder="enter what to do."
            onChange={(e) => {
              handleInputChange(e);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTodo();
              }
            }}
          />
          <ul className={styles.todoList}>
            {todos.map((todo, index) => {
              return (
                <li
                  onDoubleClick={() => {
                    handleEditTodo(index);
                  }}
                  className={styles.todoItem}
                  key={index}
                >
                  <div className={styles.todoLeft}>
                    {index === edittingIndex ? (
                      <input
                        autoFocus
                        value={todoInput}
                        className={`${styles.todoInput} ${isShaking ? styles.shake : ""}`}
                        onAnimationEnd={() => {
                          setIsShaking(false);
                        }}
                        onChange={(e) => {
                          handleTodoInputChange(e);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            setEdittingIndex(undefined);
                            return;
                          }
                          if (e.key === "Enter") {
                            handleEditTodoEnter();
                          }
                        }}
                      />
                    ) : (
                      <span
                        className={
                          todo.completed
                            ? styles.completedTodo
                            : styles.unfinishedTodo
                        }
                      >
                        • {todo.text}
                      </span>
                    )}
                  </div>
                  <div className={styles.todoRight}>
                    <button
                      className={styles.todoButton}
                      onClick={() => {
                        handleDeleteTodo(index);
                      }}
                    >
                      <FaRegTrashAlt />
                    </button>
                    <input
                      className={styles.checkboxTodo}
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => {
                        handleToggleTodo(index);
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
