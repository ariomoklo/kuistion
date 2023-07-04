
/**
 * Find username in room.playerReadyState and return boolean value 
 */
export function checkUserReadyState(username: string, room: App.Room) {
  const found = room.playerReadyState[username] ?? undefined
  if (found !== undefined) return found
  return false
}