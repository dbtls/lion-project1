export default function TodoForm({
  title,
  todoAt,
  detail,
  onTitleChange,
  onTodoAtChange,
  onDetailChange,
  onSubmit,
  loading,
}) {
  return (
    <div className="card">
      <div className="row">
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="제목(필수)"
          className="input"
        />
        <input
          type="datetime-local"
          value={todoAt}
          onChange={(e) => onTodoAtChange(e.target.value)}
          className="input"
          title="시간(필수)"
        />
      </div>

      <textarea
        value={detail}
        onChange={(e) => onDetailChange(e.target.value)}
        placeholder="상세정보(선택)"
        rows={3}
        className="textarea"
      />

      <div className="row-end">
        <button className="btn" onClick={onSubmit} disabled={loading}>
          {loading ? "등록중..." : "등록"}
        </button>
      </div>
    </div>
  );
}

