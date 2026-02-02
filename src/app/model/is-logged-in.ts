export function isLoggedIn() {
  if (!localStorage.getItem('email') || !localStorage.getItem('id')) {
    return false;
  }

  return true;
}
