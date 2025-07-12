import {
  HttpClient,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(user: User, password: string, confirmationPassword: string) {
    if (user.provider === 'google') {
      return this.http.post<User>(
        `${environment.API}/register/google`,
        {
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          sex: user.sex,
          provider: user.provider,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      );
    } else {
      return this.http.post<User>(
        `${environment.API}/register/traditional`,
        {
          email: user.email,
          password: password,
          first_name: user.firstName,
          last_name: user.lastName,
          sex: user.sex,
          provider: user.provider,
          confirmationPassword: confirmationPassword,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      );
    }
  }

  login(email: string, password: string, provider: string) {
    if (provider === 'google') {
      return this.http.post<{
        email: string;
        id: string;
        token: string;
      }>(
        `${environment.API}/login/google`,
        {
          email: email,
          provider: provider,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      );
    } else {
      return this.http.post<{
        email: string;
        id: string;
        token: string;
      }>(
        `${environment.API}/login/traditional`,
        {
          email: email,
          password: password,
          provider: provider,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      );
    }
  }

  logout() {
    this.http.delete(`${environment.API}/api/logout`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  findUsersByName(name: string) {
    return this.http.post<Array<any> | { code: number; error: string }>(
      `${environment.API}/findByName`,
      {
        name: name,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  findUserByEmail(email: string) {
    return this.http.post<
      | User
      | {
          code: number;
          error: string;
        }
    >(
      `${environment.API}/findByEmail`,
      {
        email: email,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
  findUserById(id: string) {
    return this.http.get<User | { code: number; error: string }>(
      `${environment.API}/find/${id}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  findUsersByIds(ids: number[]) {
    return this.http.post<{ user: User; profilePictureLink: string | null }[]>(
      `${environment.API}/findUsersByIds`,
      {
        ids: ids,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  getUsersInContact() {
    return this.http.get<
      { user: User; channel: string; lastMessageTimestamp: number }[]
    >(`${environment.API}/getInContact`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
  updateInfos(
    objectId: string,
    firstName: string | undefined,
    lastName: string | undefined,
    email: string | undefined,
    password: string | undefined,
    provider: string
  ) {
    if (provider !== 'google') {
      return this.http.patch<boolean>(
        `${environment.API}/update/${objectId}`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      );
    } else {
      return this.http.patch<boolean>(
        `${environment.API}/updateGoogle/${objectId}`,
        {
          first_name: firstName,
          last_name: lastName,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      );
    }
  }

  validateToken() {
    return this.http.get<boolean>(`${environment.API}/validate`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  updateProfilePicture(link: string) {
    return this.http.post<string>(
      `${environment.API}/profileImageLink`,
      {
        link: link,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  getProfilePictureLink(id: string) {
    return this.http.get<string>(
      `${environment.API}/profileImageLink/${id}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  async uploadImage(file: File, sender: string) {
    const storage = getStorage();
    let downloadUrl: string;

    const storageRef = ref(storage, `profilePicture/${sender}/${file.name}`);
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
      headers: req.headers.append('Authorization', `Bearer ${token}`),
    });
  } else {
    newReq = req.clone();
  }
  return next(newReq);
}
export class MockAuthService {}
