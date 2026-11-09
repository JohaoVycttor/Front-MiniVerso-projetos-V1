export function brief(value = '') {
  return value.trim().split(/(?<=[.!?])\s+/)[0] || '';
}
