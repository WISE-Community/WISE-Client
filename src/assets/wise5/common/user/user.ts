export function usernameComparator(object1: { username: string }, object2: { username: string }) {
  if (object1.username == null || object2.username == null) {
    return 0;
  }
  const username1 = object1.username.toLowerCase();
  const username2 = object2.username.toLowerCase();
  return username1.localeCompare(username2);
}
