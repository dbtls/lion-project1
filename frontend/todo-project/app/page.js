'use client'

import { useEffect, useState } from "react";
import { todoApi } from "../src/api/todoApi";
import Header from "../src/components/Header";
import TodoForm from "../src/components/TodoForm";
import TodoList from "../src/components/TodoList";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [todoAt, setTodoAt] = useState("");
  const [detail, setDetail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTodos = async () => {
    setError("");
    try {
      const data = await todoApi.getAllTodos();
      setTodos(data);
    } catch (e) {
      setError(e?.message || "목록 조회 오류");
      setTodos([]);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const createTodo = async () => {
    const t = title.trim();
    if (!t) return setError("제목은 필수");
    if (!todoAt) return setError("시간은 필수");

    setLoading(true);
    setError("");

    try {
      await todoApi.createTodo(t, todoAt, detail);
      setTitle("");
      setTodoAt("");
      setDetail("");
      await loadTodos();
    } catch (e) {
      setError(e?.message || "등록 오류");
    } finally {
      setLoading(false);
    }
  };

  const toggleDone = async (id) => {
    setLoading(true);
    setError("");
    try {
      await todoApi.toggleTodo(id);
      await loadTodos();
    } catch (e) {
      setError(e?.message || "체크 변경 오류");
    } finally {
      setLoading(false);
    }
  };

  const deleteDone = async () => {
    setLoading(true);
    setError("");
    try {
      await todoApi.deleteDoneTodos();
      await loadTodos();
    } catch (e) {
      setError(e?.message || "삭제 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrap">
      <Header
        onRefresh={loadTodos}
        onDeleteDone={deleteDone}
        loading={loading}
      />

      {error && <div className="error">오류: {error}</div>}

      <TodoForm
        title={title}
        todoAt={todoAt}
        detail={detail}
        onTitleChange={setTitle}
        onTodoAtChange={setTodoAt}
        onDetailChange={setDetail}
        onSubmit={createTodo}
        loading={loading}
      />

      <TodoList todos={todos} onToggle={toggleDone} />
    </div>
  );
}

