export function formatDateTime(v) {
  if (!v) return "";
  return String(v).replace("T", " ");
}

