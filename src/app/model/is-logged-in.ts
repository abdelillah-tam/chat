export function isLoggedIn() {
  if (
    !localStorage.getItem('email') ||
    !localStorage.getItem('userToken') ||
    !localStorage.getItem('objectId')
  ) {
    return false;
  }

  return true;
}
