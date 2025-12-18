export default function Header({ onRefresh, onDeleteDone, loading }) {
  return (
    <div className="header">
      <h1 style={{ margin: 0 }}>Todo 리스트</h1>

      <div className="header-actions">
        <button className="btn-ghost" onClick={onRefresh} disabled={loading}>
          새로고침
        </button>
        <button
          className="btn-danger"
          onClick={onDeleteDone}
          disabled={loading}
        >
          완료 삭제
        </button>
      </div>
    </div>
  );
}
