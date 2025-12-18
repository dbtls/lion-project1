import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle }) {
  return (
    <>
      <div className="count">총 {todos.length}개</div>

      <div className="list">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
        ))}
      </div>
    </>
  );
}

