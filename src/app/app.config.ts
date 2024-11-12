import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HashLocationStrategy,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideState, provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './state/auth/auth.reducers';
import { AuthEffects } from './state/auth/auth.effects';
import {
  chatReducer,
  imageMsgUrlReducer,
  messagesReducer,
  sendMessageReducer,
} from './state/messaging/messaging.reducers';
import { MessagingEffects } from './state/messaging/messaging.effects';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from './services/auth.service';
import { MessagingService } from './services/messaging.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    provideAnimationsAsync(),
    provideHttpClient(),
    provideStore(),
    provideState('auth', authReducer),
    provideState('sendMessage', sendMessageReducer),
    provideState('messages', messagesReducer),
    provideState('chat', chatReducer),
    provideState('imageMsgUrl', imageMsgUrlReducer),
    provideEffects(AuthEffects, MessagingEffects),
    {
      provide: AuthService,
      useFactory: (httpClient: HttpClient) => new AuthService(httpClient),
      deps: [HttpClient],
    },
    {
      provide: MessagingService,
      useFactory: (store: Store) => new MessagingService(store),
      deps: [Store],
    },
  ],
};
