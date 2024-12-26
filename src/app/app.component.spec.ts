import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideMockStore } from '@ngrx/store/testing';
import { AuthService, MockAuthService } from './services/auth.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        provideMockStore({}),
        provideAnimationsAsync(),
        provideRouter(routes)
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'chat' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('chat');
  });

  
});
