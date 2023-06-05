export function usernameComparator(object1: { username: string }, object2: { username: string }) {
  const username1 = object1.username.toLowerCase();
  const username2 = object2.username.toLowerCase();
  if (username1 < username2) {
    return -1;
  } else if (username1 > username2) {
    return 1;
  }
  return 0;
}
