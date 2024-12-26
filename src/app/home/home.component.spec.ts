import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HomeComponent } from './home.component';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../app.routes';
import { selectTokenValidation } from '../state/auth/auth.selectors';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectTokenValidation, value: false }],
        }),
        { provide: HttpClient, useClass: HttpClientTestingModule },
        {
          provide: AuthService,
          useFactory: (httpClient: HttpClient) => new AuthService(httpClient),
          deps: [HttpClient],
        },
        provideRouter(routes),
        provideAnimationsAsync()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if there is no data on localStorage', async () => {
    localStorage.clear();

    fixture.detectChanges();
    await fixture.whenStable();
    
    expect(router.url).toBe('/login');
  });

  it('should navigate to login because token is not valid', async() => {
    localStorage.setItem('email', 'email');
    localStorage.setItem('objectId', 'objectId');
    localStorage.setItem('userToken', 'userToken');

    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.url).toBe('/login');
  });
});
