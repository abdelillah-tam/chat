import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TestScheduler } from 'rxjs/testing';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
import { from, fromEvent, of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  let httpController: HttpTestingController;

  let mockUser: User;

  let testScheduler: TestScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useClass: HttpClientTestingModule },
        {
          provide: AuthService,
          useFactory: (httpClient: HttpClient) => new AuthService(httpClient),
          deps: [HttpClient],
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toBe(expected);
    });
    mockUser = {
      email: 'email',
      firstName: 'Abdelillah',
      lastName: 'Tamoussat',
      objectId: 'id',
      profileImageLink: 'link',
      provider: 'google',
      sex: 'man',
    };
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post request with mock user', () => {
    service.signUp(mockUser, 'password', 'google').subscribe((result) => {
      expect(result).toEqual(mockUser);
    });

    const req = httpController.expectOne((req) => req.body !== null);

    req.flush(mockUser);

    expect(req.request.method).toBe('POST');
  });

  it('should make request to check user token and return true', () => {
    service.verifyIfTokenValid('token').subscribe((result) => {
      expect(result).toBe(true);
    });

    const req = httpController.expectOne(
      `${environment.BACKENDLESS_BASE_URL}/users/isvalidusertoken/token`
    );

    req.flush(true);

    expect(req.request.method).toBe('GET');
  });

});
