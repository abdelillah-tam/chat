export function saveDataLocally(email: string, id: string) {
  localStorage.setItem('email', email);
  localStorage.setItem('id', id);
}
