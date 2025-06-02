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
import { map, tap } from 'rxjs';

export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(user: User, password: string, provider: string) {
    return this.http.post<User>(`${environment.API}/register`, {
      email: user.email,
      password: password,
      first_name: user.firstName,
      last_name: user.lastName,
      sex: user.sex,
      provider: provider,
    });
  }

  login(email: string, password: string) {
    return this.http.post<{
      email: string;
      id: string;
      token: string;
    }>(`${environment.API}/login`, {
      email: email,
      password: password,
    });
  }

  logout() {
    this.http.get(`${environment.BACKENDLESS_BASE_URL}/users/logout`);
  }

  findUsersByName(name: string) {
    return this.http.post<Array<any>>(`${environment.API}/findByName`, {
      name: name,
    });
  }

  findUserByEmail(email: string) {
    return this.http.post<
      | User
      | {
          code: number;
          error: string;
        }
    >(`${environment.API}/findByEmail`, {
      email: email,
    });
  }
  findUserById(id: string) {
    return this.http.get<User | { code: number; error: string }>(
      `${environment.API}/find/${id}`
    );
  }

  findUsersByIds(ids: number[]) {
    return this.http.post<{ user: User; profilePictureLink: string | null }[]>(
      `${environment.API}/findUsersByIds`,
      {
        ids: ids,
      }
    );
  }

  getUsersInContact() {
    return this.http.get<
      { user: User; channel: string; lastMessageTimestamp: number }[]
    >(`${environment.API}/getInContact`);
  }
  updateInfos(
    objectId: string,
    firstName: string | undefined,
    lastName: string | undefined,
    email: string | undefined
  ) {
    if (email) {
      return this.http.patch<User>(`${environment.API}/update/${objectId}`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
      });
    } else {
      return this.http.patch<User>(`${environment.API}/update/${objectId}`, {
        first_name: firstName,
        last_name: lastName,
      });
    }
  }

  validateToken() {
    return this.http.get<boolean>(`${environment.API}/validate`);
  }


  updateProfilePictureLink(file: File, id: string) {
    return this.http.patch<string>(`${environment.API}/profileImageLink/${id}`, {
      image: file,
    });
  }

  getProfilePictureLink(id: string) {
    return this.http.get<{ link: string }>(
      `${environment.API}/profileImageLink/${id}`
    );
  }
}

export function interceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  let token = localStorage.getItem('userToken');
  let newReq: HttpRequest<unknown>;
  if (token) {
    newReq = req.clone({
      headers: req.headers
        .append('Content-Type', 'application/json')
        .append('Authorization', `Bearer ${token}`),
    });
  } else {
    newReq = req.clone({
      headers: req.headers.append('Content-Type', 'application/json'),
    });
  }
  return next(newReq);
}
export class MockAuthService {}
