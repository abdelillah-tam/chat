import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  requestCsrfToken() {
    return this.httpClient.get(`${environment.API_CSRF}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  }

  signup(user: User, password: string, confirmationPassword: string) {
    return this.httpClient.post<User>(
      `${environment.API}/signup`,
      {
        email: user.email,
        password: password,
        first_name: user.firstName,
        last_name: user.lastName,
        provider: user.provider,
        confirmationPassword: confirmationPassword,
      },
      {
        withCredentials: true,
      },
    );
  }

  login(email: string, password: string, provider: string) {
    return this.httpClient.post<
      | {
          success: true;
          email: string;
          id: number;
        }
      | { success: false; message: string }
    >(
      `${environment.API}/login`,
      {
        email: email,
        password: password,
        provider: provider,
      },
      {
        withCredentials: true,
      },
    );
  }

  logout() {
    this.httpClient.delete(`${environment.API}/logout`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  findUsersByName(name: string) {
    return this.httpClient.post<Array<any>>(
      `${environment.API}/findByName`,
      {
        name: name,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        withCredentials: true,
      },
    );
  }

  findUserByEmail(email: string) {
    return this.httpClient.post<
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
        withCredentials: true,
      },
    );
  }
  findUserById(id: string) {
    return this.httpClient.get<User | { code: number; error: string }>(
      `${environment.API}/find/${id}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        withCredentials: true,
      },
    );
  }

  findUsersByIds(ids: number[]) {
    return this.httpClient.post<
      { user: User; profilePictureLink: string | null }[]
    >(
      `${environment.API}/findUsersByIds`,
      {
        ids: ids,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        withCredentials: true,
      },
    );
  }

  getUsersInContact() {
    return this.httpClient.get<
      { user: User; channel: string; lastMessageTimestamp: number }[]
    >(`${environment.API}/getInContact`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    });
  }
  updateInfos(
    firstName: string | undefined,
    lastName: string | undefined,
    email: string | undefined,
  ) {
   
      return this.httpClient.patch<boolean>(
        `${environment.API}/update`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          withCredentials: true,
        },
      );
    
  }

  updatePassword(
    currentPassword: string,
    newPassword: string,
    passwordConfirmation: string,
  ){
      return this.httpClient.patch<boolean>(
        `${environment.API}/updatePassword`,
        {
          current_password: currentPassword,
          new_password: newPassword,
          password_confirmation: passwordConfirmation,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          withCredentials: true,
        },
      );
  }

  validateToken() {
    return this.httpClient.get<boolean>(`${environment.API}/validate`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  uploadImage(formData: FormData) {
    return this.httpClient.post<string | { message: string; code: number }>(
      `${environment.API}/profileImageLink`,
      formData,
      {
        withCredentials: true,
      },
    );
  }

  getProfilePictureLink(id: string) {
    return this.httpClient.get<string>(
      `${environment.API}/profileImageLink/${id}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      },
    );
  }
}

export class MockAuthService {}
