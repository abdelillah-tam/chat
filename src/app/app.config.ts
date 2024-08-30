import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './state/auth/auth.reducers';
import { AuthEffects } from './state/auth/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), {
    provide: LocationStrategy, useClass: HashLocationStrategy
  },
  provideHttpClient(),
  provideAnimationsAsync(),
  provideStore(),
  provideState('auth', authReducer)
    , provideEffects(AuthEffects)]
};
