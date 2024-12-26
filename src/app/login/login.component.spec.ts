import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { LoginComponent } from './login.component';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { AuthService, MockAuthService } from '../services/auth.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { selectCurrentLoggedInUser } from '../state/auth/auth.selectors';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter(routes),
        { provide: HttpClient, useClass: HttpClientTestingModule },
        {
          provide: AuthService,
          useFactory: (httpClient: HttpClient) => new AuthService(httpClient),
          deps: [HttpClient],
        },
        provideMockStore({
          selectors: [
            {
              selector: selectCurrentLoggedInUser,
              value: undefined,
            },
          ],
        }),
        provideAnimationsAsync(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
