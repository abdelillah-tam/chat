import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideState, provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './state/auth/auth.reducers';
import { AuthEffects } from './state/auth/auth.effects';
import {
  imageMsgUrlReducer,
  messagesReducer,
  sendMessageReducer,
} from './state/messaging/messaging.reducers';
import { MessagingEffects } from './state/messaging/messaging.effects';
import { AuthService } from './services/auth.service';
import { MessagingService } from './services/messaging.service';
import { appReducer } from './state/app/app.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideStore(),
    provideState('auth', authReducer),
    provideState('sendMessage', sendMessageReducer),
    provideState('messages', messagesReducer),
    provideState('imageMsgUrl', imageMsgUrlReducer),
    provideState('appState', appReducer),
    provideEffects(AuthEffects, MessagingEffects),
    {
      provide: AuthService,
      useFactory: (httpClient: HttpClient) => new AuthService(httpClient),
      deps: [HttpClient],
    },
    {
      provide: MessagingService,
      useFactory: (store: Store) => new MessagingService(store),
      deps: [Store]
    },
  ],
};
