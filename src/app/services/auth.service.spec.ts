import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useClass: HttpClientTestingModule},
        {
          provide: AuthService,
          useFactory: (httpClient: HttpClient) => new AuthService(httpClient),
          deps: [HttpClient],
        },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
