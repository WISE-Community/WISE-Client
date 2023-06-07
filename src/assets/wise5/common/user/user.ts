export function usernameComparator(object1: { username: string }, object2: { username: string }) {
  const username1 = object1.username.toLowerCase();
  const username2 = object2.username.toLowerCase();
  return username1.localeCompare(username2);
}
