import {
  HttpClient,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(user: User, password: string) {
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
    email: string | undefined
  ) {
    if (email) {
      return this.http.patch<User>(
        `${environment.API}/update/${objectId}`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      );
    } else {
      return this.http.patch<User>(
        `${environment.API}/update/${objectId}`,
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

  updateProfilePicture(file: File) {
    let form = new FormData();

    form.append('image', file);
    return this.http.post<string>(`${environment.API}/profileImageLink`, form);
  }

  getProfilePictureLink(id: string) {
    return this.http.get<{ link: string }>(
      `${environment.API}/profileImageLink/${id}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
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
