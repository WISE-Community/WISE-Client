export function usernameComparator(object1: { username: string }, object2: { username: string }) {
  const username1 = object1.username;
  const username2 = object2.username;
  return object1.username == null || object2.username == null
    ? 0
    : username1.toLowerCase().localeCompare(username2.toLowerCase());
}
