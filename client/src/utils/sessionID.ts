export function getOrCreateSessionID() {
  let id = localStorage.getItem("safetrace-session-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("safetrace-session-id", id);
  }
  return id;
}
