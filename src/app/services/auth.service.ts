import {
  HttpClient,
  HttpEventType,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
import { getStorage, uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { tap } from 'rxjs';

export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(user: User, password: string, provider: string) {
    return this.http.post<User>(
      `${environment.BACKENDLESS_BASE_URL}/users/register`,
      {
        email: user.email,
        password: password,
        firstName: user.firstName,
        lastName: user.lastName,
        sex: user.sex,
        provider: provider,
      }
    );
  }

  login(email: string, password: string) {
    return this.http.post<{
      email: string;
      'user-token': string;
      objectId: string;
    }>(`${environment.BACKENDLESS_BASE_URL}/users/login`, {
      login: email,
      password: password,
    });
  }

  verifyIfTokenValid(userToken: string) {
    return this.http.get<boolean>(
      `${environment.BACKENDLESS_BASE_URL}/users/isvalidusertoken/${userToken}`
    );
  }

  logout() {
    this.http.get(`${environment.BACKENDLESS_BASE_URL}/users/logout`);
  }

  findUsersByName(name: string) {
    return this.http.get<Array<User>>(
      `${environment.BACKENDLESS_BASE_URL}/data/Users?where=firstName%20%3D%20'${name}'`
    );
  }

  findUserByEmail(email: string, onFind: (user: User | undefined) => void) {
    this.http
      .get<Array<User>>(
        `${environment.BACKENDLESS_BASE_URL}/data/Users?where=email%3D'${email}'` +
          `&property=%60provider%60&property=%60email%60&property=%60firstName%60&property=%60lastName%60`
      )
      .subscribe((result) => {
        onFind(result[0]);
      });
  }
  findUserByObjectId(objectId: string) {
    return this.http.get<User>(
      `${environment.BACKENDLESS_BASE_URL}/data/Users/${objectId}`
    );
  }

  findUsersByObjectId(objectsId: string[]) {
    let items: string = '(';
    objectsId.forEach((item, index) => {
      if (index !== objectsId.length - 1) {
        items += `'` + item + `',`;
      } else {
        items += `'` + item + `')`;
      }
    });
    return this.http.get<User[]>(
      `${environment.BACKENDLESS_BASE_URL}/data/Users?where=objectId%20IN%20${items}`
    );
  }

  updateInfos(
    objectId: string,
    firstName: string | undefined,
    lastName: string | undefined,
    email: string | undefined,
    password: string | undefined,
    profileImageLink: string
  ) {
    return this.http.put<User>(
      `${environment.BACKENDLESS_BASE_URL}/data/users/${objectId}`,
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        profileImageLink: profileImageLink,
      }
    );
  }

  async uploadImageProfile(file: File, user: string) {
    const storage = getStorage();
    let downloadUrl: string;

    const storageRef = ref(storage, `profilePictures/${user}/${file.name}`);
    await uploadBytes(storageRef, file);
    let url = await getDownloadURL(storageRef);
    downloadUrl = url;

    return downloadUrl;
  }
}

export function interceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  let token = localStorage.getItem('userToken');
  let newReq: HttpRequest<unknown>;
  if (token) {
    newReq = req.clone({
      headers: req.headers
        .append('Content-Type', 'application/json')
        .append('user-token', token),
    });
  } else {
    newReq = req.clone({
      headers: req.headers.append('Content-Type', 'application/json'),
    });
  }
  return next(newReq);
}
export class MockAuthService {}
