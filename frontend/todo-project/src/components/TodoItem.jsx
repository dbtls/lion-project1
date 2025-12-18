import { formatDateTime } from "../utils/formatDateTime";

export default function TodoItem({ todo, onToggle }) {
  return (
    <div className="item">
      <input
        type="checkbox"
        checked={!!todo.done}
        onChange={() => onToggle(todo.id)}
        style={{ marginTop: 4 }}
      />
      <div className="item-content">
        <div className={`title ${todo.done ? "title-done" : ""}`}>
          {todo.title}
        </div>
        <div className="meta">{formatDateTime(todo.todoAt)}</div>
        {todo.detail && <div className="detail">{todo.detail}</div>}
      </div>
    </div>
  );
}

