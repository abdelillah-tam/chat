export function saveDataLocally(
  email: string,
  userToken: string,
  objectId: string
) {
  localStorage.setItem('email', email);
  localStorage.setItem('userToken', userToken);
  localStorage.setItem('objectId', objectId);
}
